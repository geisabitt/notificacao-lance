import type { PushSubscription as WebPushSubscription } from "web-push";

const subscriptions: WebPushSubscription[] = [];

export function addSubscription(sub: WebPushSubscription) {
  subscriptions.push(sub);
}

export function getSubscriptions(): WebPushSubscription[] {
  return subscriptions;
}
