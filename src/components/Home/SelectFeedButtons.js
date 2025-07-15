import styles from './SelectFeedButtons.module.css'

export default function SelectFeedButtons({setFilterBy,onSelect}){



    return (
        <div className={styles.selectFeedContainer}>
            <button className={styles.selectFeedButton} onClick={()=>{setFilterBy('none');onSelect()}}>All Feed</button>
            <button className={styles.selectFeedButton} onClick={()=>{setFilterBy('onlyGroupsIFollow');onSelect()}}>only from groups i follow </button>
            <button className={styles.selectFeedButton} onClick={()=>{setFilterBy('none');onSelect()}}>none</button>
            <button className={styles.selectFeedButton} onClick={()=>{setFilterBy('none');onSelect()}}>none</button>


        </div>
    )

} 