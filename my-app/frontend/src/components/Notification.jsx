const Notification = ({ message, type }) => {
    return message ? (
        <div className={type}>
            {message}
        </div>
    ) : null;
}

export default Notification