import { Button } from "@maxhub/max-ui";
import React from "react";
import Button from "../Button/Button";
const mx=window.WebApp;
const Header =()=>{
    const onClose=()=>{
    mx.close();
  }
    return (
        <div className={'header'}>
            <Button onClick={onClose}>Закрыть</Button>
            <span className={'username'}>{mx.initDataUnsafe?.initData?.user?.first_name}

            </span>
        </div>
    );
};

export default Header;