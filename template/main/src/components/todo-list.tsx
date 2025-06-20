'use client';
{{TOP_IMPORTS}}
import { Plus } from 'lucide-react';

{{BOTTOM_IMPORTS}}
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Greeting } from '@components/greeting';
import { Tasks } from '@components/tasks';

{{FORM_SCHEMA}}

export function TodoList() {
  {{STATE_LOGIC}}

  {{FORM_LOGIC}}

  return (
    <div className="mx-auto flex w-full max-w-md flex-col p-6">
      <div className="mb-6 flex items-center gap-2">
        {{THEME_SWITCH}}
        <Greeting />
      </div>

      {{FORM}}

      <div className="mb-4 flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="flex-1"
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('active')}
          className="flex-1"
        >
          Active
        </Button>
        <Button
          variant={filter === 'done' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('done')}
          className="flex-1"
        >
          Done
        </Button>
      </div>
      <Tasks />
    </div>
  );
}
