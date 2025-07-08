import { useState, useEffect, useRef } from 'react';

const PAGE_SIZE = 6;

export interface JobItem {
  id: string;
  url: string;
  by: string;
  title: string;
  time: string | number;
}

const fetchJobsId: (id: string) => Promise<JobItem> = async (id: string) => {
  try {
    const res = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    if (!res.ok) throw new Error('Failed to fetch');

    const data = await res.json();
    return data;
  } catch (e) {
    throw e;
  }
};

const fetchJobsIds = async (): Promise<string[]> => {
  try {
    const res = await fetch(
      `https://hacker-news.firebaseio.com/v0/jobstories.json`
    );
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data;
  } catch (e) {
    throw e;
  }
};

const useGetJobs = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [status, setStatus] = useState<
    'loading' | 'error' | 'success' | 'iddle'
  >('iddle');
  const [ids, setIds] = useState<string[]>([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setPage] = useState(1);

  const hasMounted = useRef(false); // 👈 flag for initial call

  const fetechJobs = async () => {
    if (isLastPage) return;

    setStatus('loading');
    try {
      let allId = [...ids];
      if (allId.length === 0) {
        allId = await fetchJobsIds();
        setIds(allId);
      }

      const startIndex = (page - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const currentIds = allId.slice(startIndex, endIndex);

      if (currentIds.length < PAGE_SIZE) {
        setIsLastPage(true);
      }

      const jobsPromises = currentIds.map((id) => fetchJobsId(id));
      const jobs = await Promise.all(jobsPromises);
      setJobs((prev) => [...prev, ...jobs]);
      setPage((prev) => prev + 1);
      setStatus('success');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  // 👇 Auto-call only once on mount
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      fetechJobs();
    }
  }, []);

  // Optional: reset status
  useEffect(() => {
    if (status === 'success') {
      setTimeout(() => {
        setStatus('iddle');
      }, 1000);
    }
  }, [status]);

  return {
    isLastPage,
    jobs,
    status,
    fetechJobs,
  };
};
export default useGetJobs;
