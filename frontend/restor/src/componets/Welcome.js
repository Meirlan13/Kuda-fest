function Welcome () {
    return (
        <div>
        <div className="welcome-container">
            <img src='/images/Group_20.png' alt="Kuda Logo" className="welcome-logo" />
            <p>фестиваль breakfast в Алматы</p>
            <p>11.01.2025 - 02.02.2025</p>
            <p>завтраки целый день за 3500 тенге</p>
        </div>
        <div className="welcome-info">
            <p>KUDAFEST — это гастрономический фестиваль, который обязательно порадует любителей вкусных блюд и качественных напитков.</p>
            <a href="https://www.instagram.com/kudafest" target="_blank" rel="noopener noreferrer">
                <img src="/images/inst-logo.png" alt="Instagram" style={{ width: "32px", height: "32px" }} />
            </a>  
            <a href="https://t.me/kudafest" target="_blank" rel="noopener noreferrer">
                <img src="/images/tg-logo.png" alt="tg" style={{width: "32px", height: "32px"}} />
            </a>         
        </div>
        </div>
    )
}

export default Welcome;