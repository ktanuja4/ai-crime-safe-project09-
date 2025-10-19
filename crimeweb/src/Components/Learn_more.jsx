import React, { useState } from 'react'
import "../Styles/learn_more.css"
import cybercrimeData from './cybercrime.json';

const Learn_more = () => {
    const [openItems, setOpenItems] = useState([]);

    const toggle = (i) => {
        setOpenItems(currentOpenItems => {
            if (currentOpenItems.includes(i)) {
                return currentOpenItems.filter(item => item !== i);
            } else {
                return [...currentOpenItems, i];
            }
        });
    };

    return (
        <div id="learn-more" className="learn_more">
            <div className='title'>Learn More About Cybercrime</div>
            <div className="describe">
                <p>
                    In general, cybercrime may be defined as “Any unlawful act where a computer or communication device or computer network is used to commit or facilitate the commission of a crime”.
                </p>
                <p>
                    Below is a list of some common cybercrimes along with their explanations. This is to facilitate better understanding and reporting of complaints.
                </p>
            </div>
            <div className="container">
                <div className="accordion">
                    {cybercrimeData.map((item, i) => {
                        const isOpen = openItems.includes(i);
                        return (
                        <div className="accordion-item" key={item.id}>
                            <div className="accordion-name" onClick={() => toggle(i)}>
                                <h2>{item.name}</h2>
                                <span>{isOpen ? '-' : '+'}</span>
                            </div>
                            <div className={isOpen ? 'accordion-content show' : 'accordion-content'}>
                                {item.explanation}
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </div>
    )
}

export default Learn_more