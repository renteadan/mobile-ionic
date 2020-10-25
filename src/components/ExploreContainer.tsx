import { IonContent, IonItem, IonLabel, IonList, IonModal, IonButton } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './ExploreContainer.css';
import Service from '../service/service';

interface ContainerProps {
  name: string;
}

interface Team {
  name: string;
  city: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const [teams, setTeams] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showModal, setShowModal] = useState('');
  const service = new Service();
  useEffect(() => {
    async function loadData() {
      const result = await service.getTeams();
      service.getTeamsWithWs();
      setTeams(result);
    };
    if(!dataLoaded)
      loadData();
    setDataLoaded(true);
  }, [dataLoaded, service]);

  function generate(teams: Team[]) {
  return teams.map(team => {
    return (
      <IonItem key={team.name}
      >
        <IonLabel onClick={() => setShowModal(team.name)}>{team.name}</IonLabel>
        <IonModal
          isOpen={team.name === showModal}
        >
          <p>Team name: {team.name}</p>
          <p>Team city: {team.city}</p>
          <IonButton onClick={() => setShowModal('')}>Close</IonButton>
        </IonModal>
      </IonItem>
    );
  });
}

  return (
    <IonContent class="container">
      <IonList>
        {generate(teams)}
      </IonList>
    </IonContent>
  );
};

export default ExploreContainer;
