import React from "react";
import { ModeToggle } from "../mode-toggle";

const Header = () => {
  return (
    <div className="flex items-center justify-between ">
      <div className=""></div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <div className="flex items-center gap-1">
          
        </div>
      </div>
    </div>
  );
};

export default Header;
