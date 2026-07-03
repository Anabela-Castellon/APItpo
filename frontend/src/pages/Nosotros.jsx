import NosotrosBannerSuperior from "../components/NosotrosBannerSuperior";
import NosotrosCentro from "../assets/NosotrosCentro.png";
import "../styles/nosotros.css";

const Nosotros = () => {
  return (
    <div className="page-container nosotros-page">
      <NosotrosBannerSuperior />

      <section id="nuestra-historia" className="historia-section">
        <div className="historia-grid">
          <div className="historia-content">
            <h2>Nuestra historia</h2>
            <p>
              Somos La Esquina, una pastelería con más de 20 años de tradición en la elaboración de
              productos artesanales de alta calidad. Cada receta tiene su historia, cada ingrediente
              es seleccionado con cuidado, y cada producto que sale de nuestras manos lleva el amor
              y dedicación que nos caracteriza.
            </p>
          </div>

          <div className="historia-image-wrapper">
            <img
              src={NosotrosCentro}
              alt="Nosotros"
              className="historia-image"
            />
          </div>
        </div>
      </section>

      <section id="equipo" className="equipo-section">
        <div className="equipo-content">
          <h2>Conocer al equipo</h2>
          <p>
            Nuestro equipo está compuesto por maestros pasteleros con pasión por su arte.
            Trabajamos todos los días para traerte los mejores productos, hechos con amor
            y dedicación.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;

