
const PointsDisplay = ({points}) => {

    return(
    <div className="points-display">
        <h4>Total Points: {points}</h4>
        <p className="tiny-text">Please note points for rows/columns/diagonals are currently untested :)</p>
    </div>

)
}

export default PointsDisplay;