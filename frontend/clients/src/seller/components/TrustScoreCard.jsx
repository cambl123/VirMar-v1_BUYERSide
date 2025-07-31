import React from 'react';

const TrustScoreCard = () => {
    return (
        <div className="card">
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <p className="title is-4">Trust Score</p>
                    </div>
                </div>
                <div className="content">
                    <p className="title is-1">85</p>
                    <p>out of 100</p>
                </div>
            </div>
        </div>
    );
};

export default TrustScoreCard;