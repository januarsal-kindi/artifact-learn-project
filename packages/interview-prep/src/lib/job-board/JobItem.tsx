import styles from  './job-board.module.scss'


export type JobItemsProps = {
  url: string;
  by: string;
  title: string;
  time: string | number;
};

export default function JobItem({ url, by, time, title }: JobItemsProps) {
  return (
    <div className={styles.post} role="listitem">
      <h2 className={styles.post__title}>
        {url ? (
          <a href={url} target="_blank" rel="noopener">
            {title}
          </a>
        ) : (
          title
        )}
      </h2>
      <p className={styles.post__metadata}>
        By {by} &middot;{' '}
        {new Date(
          typeof time === 'number' ? time * 1000 : time
        ).toLocaleString()}
      </p>
    </div>
  );
}
