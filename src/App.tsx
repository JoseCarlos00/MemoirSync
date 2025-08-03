import { Link } from "react-router-dom"

function App() {
  return (
		<>
			<h1 className='text-3xl font-bold underline'>Hello world!</h1>

			<ul>
				<li>
					<Link to='/'>Home</Link>
				</li>
				<li>
					<Link to='/login'>Login</Link>
				</li>
				<li>
					<Link to='/chat'>Chat</Link>
				</li>
			</ul>
		</>
	);
}

export default App
