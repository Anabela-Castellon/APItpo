import "../styles/nosotrosBanner.css";

const NosotrosBannerSuperior = () => {
  return (
    <div className="nosotros-banner-container">
      <img
        src="/src/assets/NosotrosBannerSuperior.png"
        alt="Banner Nosotros"
        className="nosotros-banner-image"
      />
      <div className="nosotros-banner-overlay">
        <div className="nosotros-banner-content">
          <div className="nosotros-buttons">
            <button 
              className="btn btn-history"
              onClick={() => {
                document.getElementById("nuestra-historia")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Nuestra historia
            </button>
            <button 
              className="btn btn-team"
              onClick={() => {
                document.getElementById("equipo")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Conocer al equipo ♥
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NosotrosBannerSuperior;
