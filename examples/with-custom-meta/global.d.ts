declare module 'untodo' {
  interface TodoMeta {
    issue?: number | string;
    assignee?: string;
    severity?: 'low' | 'medium' | 'high';
  }
  interface FixmeMeta {
    issue?: number | string;
  }
  interface HackMeta {
    issue?: number | string;
  }
}

export {};
