import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
		<div>
			<h1>Página no encontrada</h1>
			<p>La página que estás buscando no existe.</p>

			<Link to='/'>Volver al inicio</Link>
		</div>
	);
}

export default NotFoundPage;
