import Todo from "./Todo.jsx";

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <>
      {todos.map(todo => <Todo key={todo.id} todo={todo} onDelete={deleteTodo} onComplete={completeTodo} />)
          .reduce((acc, cur) => [...acc, <hr />, cur], [])}
    </>
    )
}

export default TodoList
