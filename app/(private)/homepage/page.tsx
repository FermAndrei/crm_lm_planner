import React from "react";
import Image from "next/image";

const HomePage = () => {
  return (
    <>
      <div className="p-8">
        <h1 className="text-sm font-medium text-[#1E6E25]">CARD SME BANK</h1>
        <h2 className="text-3xl text-[#666666] font-extrabold">
          Good Day! <span className="text-[#5C7F47]">John Doe</span>
        </h2>

        <div className="relative w-full h-200 mt-10">
          <Image
            src="/image.png"
            alt="Description"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
