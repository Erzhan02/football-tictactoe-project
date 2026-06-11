import { readFileSync, writeFileSync } from 'fs';
import { PLAYERS } from '../../prisma/curatedPlayers.js';

const filePath = 'prisma/curatedPlayers.ts';

const nameMapping: Record<string, string> = {
  "Cristiano Ronaldo dos Santos Aveiro": "Cristiano Ronaldo",
  "Lionel Andrés Messi Cuccittini": "Lionel Messi",
  "Ricardo Izecson dos Santos Leite": "Kaká",
  "Francesc Fàbregas i Soler": "Cesc Fàbregas",
  "Andrés Iniesta Luján": "Andrés Iniesta",
  "Neymar da Silva Santos Júnior": "Neymar Jr",
  "Kylian Mbappé Lottin": "Kylian Mbappé",
  "Xavier Hernández Creus": "Xavi",
  "Sergio Ramos García": "Sergio Ramos",
  "Raphaël Adelino José Guerreiro": "Raphaël Guerreiro",
  "José Luis Mato Sanmartín": "Joselu",
  "Georginio Gregion Emile Wijnaldum": "Georginio Wijnaldum",
  "Luís Carlos Almeida da Cunha": "Nani",
  "David Josué Jiménez Silva": "David Silva",
  "Álvaro Borja Morata Martín": "Álvaro Morata",
  "Marco Asensio Willemsen": "Marco Asensio",
  "Thiago Emiliano da Silva": "Thiago Silva",
  "Lucas François Bernard Hernández Pi": "Lucas Hernández",
  "Sergio Leonel Agüero del Castillo": "Sergio Agüero",
  "Iker Casillas Fernández": "Iker Casillas",
  "Ederson Santana de Moraes": "Ederson",
  "Alisson Ramsés Becker": "Alisson",
  "Danilo Luiz da Silva": "Danilo",
  "Fábio Henrique Tavares": "Fabinho",
  "Luiz Frello Filho Jorge": "Jorginho",
  "Marcus Lilian Thuram-Ulien": "Marcus Thuram",
  "Vinícius José Paixão de Oliveira Júnior": "Vinícius Júnior",
  "João Pedro Cavaco Cancelo": "João Cancelo",
  "João Félix Sequeira": "João Félix",
  "Brahim Abdelkader Díaz": "Brahim Díaz",
  "André Miguel Valente da Silva": "André Silva",
  "Tanguy Ndombèlé Alvaro": "Tanguy Ndombèlé",
  "Radamel Falcao García Zárate": "Radamel Falcao",
  "Marcos Paulo Mesquita Lopes": "Rony Lopes",
  "Osvaldo Nicolás Fabián Gaitán": "Nico Gaitán",
  "Héctor Alfredo Moreno Herrera": "Héctor Moreno",
  "Claudio Andrés Bravo Muñoz": "Claudio Bravo",
  "Alexis Alejandro Sánchez Sánchez": "Alexis Sánchez",
  "Arthur Henrique Ramos de Oliveira Melo": "Arthur Melo",
  "James David Rodríguez Rubio": "James Rodríguez",
  "Javier Hernández Balcázar": "Chicharito",
  "Toby Albertine Maurits Alderweireld": "Toby Alderweireld",
  "Jan Bert Lieve Vertonghen": "Jan Vertonghen",
  "Norberto Bercique Gomes Betuncal": "Beto",
  "Rui Pedro dos Santos Patrício": "Rui Patrício",
  "Fabián Ruiz Peña": "Fabián Ruiz",
  "Marc Cucurella Saseta": "Marc Cucurella",
  "Denis Suárez Fernández": "Denis Suárez",
  "Gerard Piqué Bernabéu": "Gerard Piqué",
  "Roberto Soldado Rillo": "Roberto Soldado",
  "Gary Alexis Medel Soto": "Gary Medel",
  "Jesé Rodríguez Ruiz": "Jesé",
  "Fernando Javier Llorente Torres": "Fernando Llorente",
  "Alberto Facundo Costa": "Tino Costa",
  "Xabier Alonso Olano": "Xabi Alonso",
  "Theo Bernard François Hernández": "Theo Hernández",
  "Florian Tristan Mariano Thauvin": "Florian Thauvin",
  "Ángel Fabián Di María Hernández": "Ángel Di María",
  "Édouard Mendy": "Édouard Mendy",
  "Íñigo Martínez Berridi": "Íñigo Martínez",
  "遠藤 航": "Wataru Endo",
  "김민재 金敏在": "Kim Min-jae"
};

const updatedPlayers = PLAYERS.map(player => {
  const commonName = nameMapping[player.name];
  if (commonName) {
    return {
      ...player,
      name: commonName
    };
  }
  return player;
});

const tsContent = `// Curated famous players list (generated from DB)
export interface PlayerSeed {
  id: string;
  name: string;
  aliases: string[];
  nationality?: string;
  position?: string;
  clubs: string[];
  leagues: string[];
  managers: string[];
  tournaments: string[];
}

export const PLAYERS: PlayerSeed[] = ${JSON.stringify(updatedPlayers, null, 2)};
`;

writeFileSync(filePath, tsContent);
console.log('Successfully shortened names in curatedPlayers.ts!');
