import Link from 'next/link';
import Layout from '@/components/Layout';
import EventItem from '@/components/EventItem';
import { API_URL } from '@/config/index';

const PER_PAGE = 2;

export default function EventsPage({ events }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map(evt => (
        <EventItem key={evt.id} evt={evt} />
      ))}
    </Layout>
  );
}

export async function getServerSideProps({ query: { page = 1 } }) {
  // Calculate start page
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

  // Fetch total/count
  const totalRes = await fetch(`${API_URL}/api/events/count`);
  const total = await totalRes.json();

  const res = await fetch(
    `${API_URL}/api/events?populate=*&_sort=date:ASC&_limit=${PER_PAGE}&_start=${start}`
  );

  const events = await res.json();
  return {
    props: { events: events.data, page: +page, total }
  };
}
