import useGetJobs from './useGetJobs';
import JobItem from './JobItem';
import styles from './job-board.module.scss'

export default function JobBoard() {
  const { jobs: data, status, fetechJobs, isLastPage } = useGetJobs();

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Hacker News Jobs Board</h1>
      {data?.map((item) => (
        <JobItem
          key={item.id}
          url={item.url}
          by={item.by}
          time={item.time}
          title={item.title}
        />
      ))}
      {status === 'loading' && <p className={styles.loading}>Loading...</p>}
      {status === 'iddle' && !isLastPage && (
        <button className={styles.loadMore} onClick={() => fetechJobs()}>
          Load More
        </button>
      )}
    </div>
  );
}
