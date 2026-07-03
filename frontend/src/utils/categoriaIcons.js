import iconTodos from '../assets/todos.svg';
import iconPanificados from '../assets/panificados.svg';
import iconTortas from '../assets/tortas.svg';
import iconCafes from '../assets/cafes.svg';
import iconBebidas from '../assets/bebidas.svg';
import iconCombos from '../assets/combos.svg';
import iconPromos from '../assets/promos.svg';

// Pasa a minúsculas y quita acentos (para comparar nombres de categoría sin distinguir tildes/mayúsculas)
export const normalizar = (str) => str?.toLowerCase().normalize('NFD').replace(new RegExp('[̀-ͯ]', 'g'), '') || '';

// Ícono a mostrar según el nombre normalizado de la categoría
export const iconosPorCategoria = {
  panificados: iconPanificados,
  tortas: iconTortas,
  cafes: iconCafes,
  bebidas: iconBebidas,
  combos: iconCombos,
  promos: iconPromos,
};

const ORDEN_CATEGORIAS = ['panificados', 'tortas', 'cafes', 'bebidas', 'combos', 'promos'];

// Ordena las categorías según ORDEN_CATEGORIAS; las que no están en la lista van al final
export function ordenarCategorias(categorias) {
  return [...categorias].sort((a, b) => {
    const posA = ORDEN_CATEGORIAS.indexOf(normalizar(a.nombre));
    const posB = ORDEN_CATEGORIAS.indexOf(normalizar(b.nombre));
    return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB);
  });
}

export { iconTodos };
