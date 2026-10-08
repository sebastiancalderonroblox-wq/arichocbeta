const form = document.getElementById('form-detalles');
const lista = document.getElementById('lista-detalles');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = document.getElementById('id_detalles').value;
  const nombre = document.getElementById('nombre_detalle').value;
  const color = document.getElementById('color').value;
  const mensaje = document.getElementById('mensaje').value;
  const precio = document.getElementById('precio').value;
  const stock = document.getElementById('stock').value;

  const item = document.createElement('div');
  item.className = 'tarjeta-item';
  item.innerHTML = `
    <strong>ID:</strong> ${id}<br>
    <strong>Nombre:</strong> ${nombre}<br>
    <strong>Color:</strong> ${color}<br>
    <strong>Mensaje:</strong> "${mensaje}"<br>
    <strong>Precio:</strong> $${precio}<br>
    <strong>Stock:</strong> ${stock}
  `;

  lista.prepend(item);
  form.reset();
});