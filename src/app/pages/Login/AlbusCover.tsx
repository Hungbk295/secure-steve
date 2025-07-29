import AlbusCoverImage from "@/assets/images/albus-cover.png";
import "@/styles/login.css";

function AlbusCover() {
  return (
    <div className="relative albus-cover">
      <div
        style={{ backgroundImage: `url(${AlbusCoverImage})` }}
        className="h-screen w-[50vw] bg-cover bg-center"
      />
      <div className="slogan">
        <span>Where the modern flight</span>
        <br />
        <span>business begins</span>
      </div>
    </div>
  );
}

export default AlbusCover;
