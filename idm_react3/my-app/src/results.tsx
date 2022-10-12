import './results.css';
import {ReactComponent as SavedSvg} from './saved-svg.svg';

function results() {

    return (
        <div className="container">
            <SavedSvg className="svg"/>
            <div className="top-block">
                <p className="move-name">The Brooklyn</p>
            </div>
            <div className="bottom-block">

                <div className="bottom-left-block">
                    <p> similar moves include...</p>
                </div>

                <div className="bottom-right-block">
                    <div>
                        <p>Monastery</p>
                        <p>Stick & Roll</p>
                        <p>Charleston</p>
                    </div>
                    <div> 
                        <p>43%</p>
                        <p>12%</p>
                        <p>0.5%</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default results;