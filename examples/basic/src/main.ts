import { TODO } from 'untodo';
import './setup';

interface User {
  id: string;
  name: string;
}

function fetchUser(): User {
  return TODO({ reason: 'wire up the user repository' });
}

const user = fetchUser();
console.log(user);
