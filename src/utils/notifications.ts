import { SavedEvent } from "../types";
import { parseLocalMidnightDate } from "./dateCalculators";

export function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support standard desktop notification.");
    return Promise.resolve(false);
  }

  return Notification.requestPermission().then((permission) => {
    return permission === "granted";
  });
}

export function triggerLocalPushNotification(title: string, body: string) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        body: body,
        icon: "/favicon.ico",
      });
    } catch (e) {
      console.error("Failed to create native desktop Notification:", e);
    }
  }
}

/**
 * Checks if there is any upcoming saved birthday / event triggering alerts.
 * Returns message descriptors for qualifying events.
 */
export function checkUpcomingAnniversaries(savedEvents: SavedEvent[]): { title: string; body: string; id: string }[] {
  const alerts: { title: string; body: string; id: string }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  savedEvents.forEach((event) => {
    if (!event.isNotificationEnabled) return;

    const dob = parseLocalMidnightDate(event.birthDate);
    
    // Set birthday to current year
    let nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate(), 0, 0, 0, 0);
    if (today > nextBday) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = nextBday.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    if (daysRemaining === event.notifyBeforeDays) {
      const age = nextBday.getFullYear() - dob.getFullYear();
      let alertMsg = "";
      
      if (daysRemaining === 0) {
        alertMsg = `Happy Birthday to ${event.name}! 🎉 Turning ${age} years old today!`;
      } else {
        alertMsg = `${event.name}'s birthday is in ${daysRemaining} days! 🎂 Preparing to turn ${age}.`;
      }

      alerts.push({
        title: "Upcoming Celebration! 🎈",
        body: alertMsg,
        id: event.id,
      });
    }
  });

  return alerts;
}
