// src/lib/subscriptions.ts
import type { PushSubscription as WebPushSubscription } from "web-push";

const subscriptions: WebPushSubscription[] = [];

export function addSubscription(sub: WebPushSubscription) {
  const exists = subscriptions.find((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subscriptions.push(sub);
    // nova inscricao adicionada
  } else {
    // inscricao já existe
  }
}

export function getSubscriptions(): WebPushSubscription[] {
  return subscriptions;
}

export function removeSubscription(endpoint: string) {
  const index = subscriptions.findIndex((s) => s.endpoint === endpoint);
  if (index !== -1) {
    subscriptions.splice(index, 1);
    // inscricao removida
  }
}
