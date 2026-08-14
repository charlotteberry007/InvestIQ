import planet from "../../assets/planet.png";
import stars from "../../assets/stars.png";
import network from "../../assets/network.png";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#040816]">

      {/* Stars */}
      <img
        src={stars}
        alt=""
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-25
          select-none
          pointer-events-none
        "
      />

      {/* Planet */}
      <img
        src={planet}
        alt=""
        className="
          absolute
          -left-28
          top-20
          w-[850px]
          max-w-none
          opacity-80
          select-none
          pointer-events-none
        "
      />

      {/* Network */}
      <img
        src={network}
        alt=""
        className="
          absolute
          right-0
          top-0
          w-[900px]
          max-w-none
          opacity-18
          select-none
          pointer-events-none
        "
      />

      {/* Blue Glow */}
      <div
        className="
          absolute
          -left-56
          top-24
          h-[700px]
          w-[700px]
          rounded-full
          bg-blue-600/20
          blur-[180px]
        "
      />

      {/* Purple Glow */}
      <div
        className="
          absolute
          -right-40
          top-10
          h-[500px]
          w-[500px]
          rounded-full
          bg-violet-600/10
          blur-[180px]
        "
      />

      {/* Dark Gradient Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-[#040816]/20
          via-[#040816]/45
          to-[#040816]
        "
      />

    </div>
  );
}