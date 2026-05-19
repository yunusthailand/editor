export const alignmentOptions = [
  {
    value: "left",
    label: "Left",
  },
  {
    value: "right",
    label: "Right",
  },
  {
    value: "center",
    label: "Center",
  },
];

export const bgOptions = [
  {
    value: "white",
    label: "White",
  },
  {
    value: "black",
    label: "Black",
  },
  {
    value: "slategray",
    label: "primary",
  },
];

export const eleOptions = [
  {
    type: "heading",
    load: { text: "Batman, Turkey" },
    label: "Heading",
  },
  {
    type: "paragraph",
    desc: " To create a link write [text](url) e.g. [Search](google.com)",
    load: {
      text: "Batman is connected by highways and railway with the nearby cities of Diyarbakır and Kurtalan and with the capital Ankara. The distance (using highways) to Istanbul is 1,465 km (910 mi), to Ankara 1,012 km (629 mi), and to İzmir 1,520 km (944 mi)",
    },
    label: "Paragraph",
  },
  {
    type: "imageCaption",
    load: {
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Tigris_2015.jpg/1920px-Tigris_2015.jpg",
      text: "The Tigris river in Batman Province.",
    },
    label: "Image with Caption",
  },
  {
    type: "spacer",
    load: { placehold: "mockery" },
    label: "Spacer",
  },
  {
    type: "combo",
    load: {
      head: "Early history",
      text: "The Batman Province contains the strategic Tigris River with fertile lands by its sides, as well as rocky hills with numerous caves providing a natural shelter. As a result, it was inhabited from prehistoric times, likely from the Neolithic (Paleolithic)[contradictory] period, according to archeological evidence.",
    },
    label: "Combo",
  },
  {
    type: "list",
    desc: "Write in comma seperated values like Sam , [Frodo](wikipedia.com) , Boromir",

    load: {
      head: "Climate",
      array: ["Sam", "[Frodo](wikipedia.com)", "Boromir"],
    },
    label: "List",
  },
  {
    type: "videoEmbed",
    desc: "Copy link from YouTube to display it here",
    load: {
      text: "https://www.youtube.com/watch?v=z-qigE1ym40&ab_channel=InnerPeaceLookInside",
    },
    label: "VideoEmbed",
  },
];
