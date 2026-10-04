import { Inngest } from "inngest";
import attendanceModel from "../models/attendanceModel.js";
import employeeModel from "../models/employeeModel.js";
import leaveApplicationModel from "../models/leaveApplicationModel.js";
import sendEmail from "../config/nodemailer.js";

// ============================================================
// Inngest Client
// ============================================================

// Create an Inngest client for the Employee Management System
export const inngest = new Inngest({
  id: "ems",
  eventKey: process.INNGEST_EVENT_KEY,
});

// ============================================================
// 1. AUTO CHECK-OUT EMPLOYEE
// ============================================================
// Trigger:
// employee/check-out
//
// Purpose:
// If an employee forgets to check out, send a reminder after
// 9 hours and automatically check them out after another hour.
// ============================================================

const autoCheckOut = inngest.createFunction(
  {
    id: "auto-check-out",
    triggers: {
      event: "employee/check-out",
    },
  },

  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    // ----------------------------------------------------------
    // Step 1: Wait for 9 hours
    // ----------------------------------------------------------

    await step.sleepUntil(
      "wait-for-the-9-hours",
      new Date(Date.now() + 9 * 60 * 60 * 1000),
    );

    // ----------------------------------------------------------
    // Step 2: Get attendance record
    // ----------------------------------------------------------

    let attendance = await attendanceModel.findById(attendanceId);

    // ----------------------------------------------------------
    // Step 3: Check whether employee has already checked out
    // ----------------------------------------------------------

    if (!attendance?.checkOut) {
      // Get employee information
      const employee = await employeeModel.findById(employeeId);

      // --------------------------------------------------------
      // Step 4: Send check-out reminder email
      // --------------------------------------------------------

      if (employee) {
        await sendEmail(
          employee.email,
          "Attendance Check-Out Reminder",
          `
            <div style="max-width: 600px; font-family: Arial, sans-serif;">
              <h2>Hi ${employee.firstName}, 👋</h2>

              <p style="font-size: 16px;">
                You have a check-in in the ${employee.department} department today.
              </p>

              <p style="font-size: 18px; font-weight: bold; color: #007bff;">
                Check-in time:
                ${attendance?.checkIn?.toLocaleTimeString()}
              </p>

              <p style="font-size: 16px;">
                Please make sure to check out within the next hour.
              </p>

              <p style="font-size: 16px;">
                If you have any questions, please contact your admin.
              </p>

              <br />

              <p style="font-size: 16px;">Best Regards,</p>
              <p style="font-size: 16px;">EMS</p>
            </div>
          `,
        );
      }

      // --------------------------------------------------------
      // Step 5: Wait for another hour
      // --------------------------------------------------------

      await step.sleepUntil(
        "wait-for-the-1-hour",
        new Date(Date.now() + 10 * 60 * 60 * 1000),
      );

      // --------------------------------------------------------
      // Step 6: Fetch attendance record again
      // --------------------------------------------------------

      attendance = await attendanceModel.findById(attendanceId);

      // --------------------------------------------------------
      // Step 7: Automatically check out the employee if they
      // still haven't checked out
      // --------------------------------------------------------

      if (!attendance?.checkOut && attendance?.checkIn) {
        const checkInTime = new Date(attendance.checkIn).getTime();

        const automaticCheckOutTime = checkInTime + 10 * 60 * 60 * 1000;

        attendance.checkOut = new Date(automaticCheckOutTime);

        // Calculate actual working hours based on automatic checkout
        const workingHours =
          (automaticCheckOutTime - checkInTime) / (1000 * 60 * 60);

        attendance.workingHours = Number(workingHours.toFixed(2));

        // Keep your existing business rule:
        // Automatically checked-out attendance is marked as LATE.
        attendance.status = "LATE";

        // Based on 10 hours, this falls under Full Day.
        attendance.dayType = "Full Day";

        await attendance.save();
      }
    }
  },
);

// ============================================================
// 2. LEAVE APPLICATION REMINDER
// ============================================================
// Trigger:
// leave/pending
//
// Purpose:
// If a leave application remains pending for 24 hours,
// send a reminder email to the admin.
// ============================================================

const leaveApplicationReminder = inngest.createFunction(
  {
    id: "leave-application-reminder",
    triggers: {
      event: "leave/pending",
    },
  },

  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    // ----------------------------------------------------------
    // Step 1: Wait for 24 hours
    // ----------------------------------------------------------

    await step.sleepUntil(
      "wait-for-the-24-hours",
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );

    // ----------------------------------------------------------
    // Step 2: Get leave application
    // ----------------------------------------------------------

    const leaveApplication =
      await leaveApplicationModel.findById(leaveApplicationId);

    // If leave application doesn't exist, stop the function
    if (!leaveApplication) {
      return;
    }

    // ----------------------------------------------------------
    // Step 3: Check whether the application is still pending
    // ----------------------------------------------------------

    if (leaveApplication.status === "PENDING") {
      // Get employee information
      const employee = await employeeModel.findById(
        leaveApplication.employeeId,
      );

      // --------------------------------------------------------
      // Step 4: Send reminder email to admin
      // --------------------------------------------------------

      if (employee) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "Leave Application Reminder",
          `
            <div style="max-width: 600px; font-family: Arial, sans-serif;">
              <h2>Hi Admin, 👋</h2>

              <p style="font-size: 16px;">
                You have a pending leave application from
                ${employee.firstName} ${employee.lastName}.
              </p>

              <p style="font-size: 16px;">
                Department: ${employee.department}
              </p>

              <p style="font-size: 18px; font-weight: bold; color: #007bff;">
                Leave starts:
                ${leaveApplication?.startDate?.toLocaleDateString()}
              </p>

              <p style="font-size: 16px;">
                Please take action on this leave application.
              </p>

              <br />

              <p style="font-size: 16px;">Best Regards,</p>
              <p style="font-size: 16px;">EMS</p>
            </div>
          `,
        );
      }
    }
  },
);

// ============================================================
// 3. ATTENDANCE REMINDER CRON JOB
// ============================================================
// Schedule:
// 11:30 AM IST every day
//
// Cron:
// TZ=Asia/Kolkata 30 11 * * *
//
// Purpose:
// Find active employees who haven't checked in and aren't
// on approved leave, then send them a reminder email.
// ============================================================

const attendanceReminderCron = inngest.createFunction(
  {
    id: "attendance-reminder-cron",
    triggers: {
      cron: "TZ=Asia/Kolkata 30 11 * * *",
    },
  },

  async ({ step }) => {
    // ----------------------------------------------------------
    // Step 1: Get today's date range in IST
    // ----------------------------------------------------------

    const today = await step.run("get-today-date", () => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(new Date());

      const dateParts = {};

      for (const part of parts) {
        if (part.type !== "literal") {
          dateParts[part.type] = part.value;
        }
      }

      const dateString = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;

      const startUTC = new Date(`${dateString}T00:00:00+05:30`);

      const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);

      return {
        startUTC: startUTC.toISOString(),
        endUTC: endUTC.toISOString(),
      };
    });
    // ----------------------------------------------------------
    // Step 2: Get all active and non-deleted employees
    // ----------------------------------------------------------

    const activeEmployees = await step.run("get-active-employees", async () => {
      const employees = await employeeModel
        .find({
          isDeleted: false,
          employmentStatus: "ACTIVE",
        })
        .lean();

      return employees.map((e) => ({
        _id: e._id.toString(),
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.department,
      }));
    });

    // ----------------------------------------------------------
    // Step 3: Get employee IDs of employees who are on
    // approved leave today
    // ----------------------------------------------------------

    const onLeaveIds = await step.run("get-on-leave-ids", async () => {
      const leaves = await leaveApplicationModel
        .find({
          status: "APPROVED",

          startDate: {
            $lte: new Date(today.endUTC),
          },

          endDate: {
            $gte: new Date(today.startUTC),
          },
        })
        .lean();

      return leaves.map((leave) => leave.employeeId.toString());
    });

    // ----------------------------------------------------------
    // Step 4: Get employee IDs of employees who have already
    // checked in today
    // ----------------------------------------------------------

    const checkedInIds = await step.run("get-checked-in-ids", async () => {
      const attendances = await attendanceModel
        .find({
          date: {
            $gte: new Date(today.startUTC),
            $lt: new Date(today.endUTC),
          },
        })
        .lean();

      return attendances.map((attendance) => attendance.employeeId.toString());
    });

    // ----------------------------------------------------------
    // Step 5: Find absent employees
    //
    // An employee is considered absent if:
    // 1. They are active
    // 2. They are not on approved leave
    // 3. They haven't checked in today
    // ----------------------------------------------------------

    const absentEmployees = activeEmployees.filter(
      (employee) =>
        !onLeaveIds.includes(employee._id) &&
        !checkedInIds.includes(employee._id),
    );

    // ----------------------------------------------------------
    // Step 6: Send reminder emails to absent employees
    // ----------------------------------------------------------

    if (absentEmployees.length > 0) {
      await step.run("send-reminder-emails", async () => {
        const emailPromises = absentEmployees.map(async (employee) => {
          await sendEmail(
            employee.email,
            "Attendance Reminder - Please Mark Your Attendance",
            `
                  <div style="max-width: 600px; font-family: Arial, sans-serif;">
                    <h2>Hi ${employee.firstName}, 👋</h2>

                    <p style="font-size: 16px;">
                      We noticed you haven't marked your attendance
                      yet today.
                    </p>

                    <p style="font-size: 16px;">
                      The attendance reminder time was
                      <strong>11:30 AM</strong>.
                    </p>

                    <p style="font-size: 16px;">
                      Please check in as soon as possible or contact
                      your admin if you're facing any issues.
                    </p>

                    <br />

                    <p style="font-size: 14px; color: #666;">
                      Department: ${employee.department}
                    </p>

                    <br />

                    <p style="font-size: 16px;">
                      Best Regards,
                    </p>

                    <p style="font-size: 16px;">
                      <strong>QuickEMS</strong>
                    </p>
                  </div>
                `,
          );
        });

        await Promise.all(emailPromises);
      });
    }

    // ----------------------------------------------------------
    // Step 7: Return attendance summary
    // ----------------------------------------------------------

    return {
      totalActive: activeEmployees.length,
      onLeave: onLeaveIds.length,
      checkedIn: checkedInIds.length,
      absent: absentEmployees.length,
    };
  },
);

// ============================================================
// Export All Inngest Functions
// ============================================================

export const functions = [
  autoCheckOut,
  leaveApplicationReminder,
  attendanceReminderCron,
];
