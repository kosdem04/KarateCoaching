import React from "react";
import './DeleteSportsmanModal.css'; // Создайте CSS для стилизации модального окна

const DeleteSportsmanModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Подтверждение удаления</h2>
                <p>Вы уверены, что хотите удалить этого спортсмена?</p>
                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>Отмена</button>
                    <button className="delete-button" onClick={onConfirm}>Удалить</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSportsmanModal;
