import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const PER_PAGE = 9;

  const changeType = (evtType) => {
    console.log("New Type", evtType)
    setCurrentPage(1);
    setType(evtType);
  };
  const filteredEvents = (
    (!type
      ? data?.events
      : data?.events.filter((event) => event.type === type)) || []
  ).filter((event, index) => {
    if ((currentPage - 1) * PER_PAGE <= index && PER_PAGE * currentPage > index) {
      return true;
    }
    return false;
  });

  const pageNumber = Math.ceil((filteredEvents?.length || 0) / PER_PAGE);
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => changeType(value)}
          />
          <div id="events" className="ListContainer">
            {filteredEvents
              .slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
              .map((event) => (
                <Modal key={event.id} Content={<ModalEvent event={event} />}>
                  {({ setIsOpened }) => (
                    <EventCard
                      onClick={() => setIsOpened(true)}
                      imageSrc={event.cover}
                      title={event.title}
                      date={new Date(event.date)}
                      label={event.type}
                    />
                  )}
                </Modal>
              ))}
          </div>
          <div className="Pagination">
  {Array.from({ length: pageNumber }, (_, index) => (
    <a
      key={`page-${index}`}
      href="#events"
      onClick={() => setCurrentPage(index + 1)}
    >
      {index + 1}
    </a>
  ))}
</div>

        </>
      )}
    </>
  );
};

export default EventList;
