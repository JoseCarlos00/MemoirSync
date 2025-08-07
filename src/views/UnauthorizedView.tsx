import { Link } from 'react-router-dom';

function UnauthorizedView() {
	return (
		<div>
			<h1>Acceso Denegado (403)</h1>
			<p>No tienes los permisos necesarios para ver esta página.</p>
			<Link to='/'>Volver al inicio</Link>

		</div>
	);
}

export default UnauthorizedView;
