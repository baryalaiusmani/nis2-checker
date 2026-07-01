export function TodoList({ todos }: { todos: string[] }) {
  if (todos.length === 0) {
    return <p className="text-gray-600">Keine offenen To-Dos. Sehr gut!</p>;
  }

  return (
    <ol className="flex flex-col gap-3">
      {todos.map((todo, index) => (
        <li key={todo} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {index + 1}
          </span>
          <span className="text-gray-800">{todo}</span>
        </li>
      ))}
    </ol>
  );
}
