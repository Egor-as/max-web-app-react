import React from 'react';
import Button from "../Button/Button";
import { useMax } from '../../hooks/useMax';
import './Header.css';

const Header = () => {
    const {user, onClose} = useMax();

    return (
        <div className={'header'}>
            <Button onClick={onClose}>Закрыть</Button>
            <span className={'username'}>
                {user?.username}
            </span>
        </div>
    );
};

export default Header;