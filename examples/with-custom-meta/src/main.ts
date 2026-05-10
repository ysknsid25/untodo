import { TODO } from 'untodo';
import '../untodo.config';

interface Order {
  id: string;
}

function placeOrder(): Order {
  return TODO({
    reason: 'integrate payment provider',
    issue: 42,
    assignee: 'kanon',
    severity: 'high',
  });
}

placeOrder();
