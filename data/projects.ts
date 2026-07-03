export type MaterialIcon =
  | "FileText"
  | "Image"
  | "CirclePlay"
  | "Rotate3d"
  | "Video"
  | "Eye";

export type Material = {
  id?: number;
  title: string;
  subtitle: string;
  type: string;
  size: string;
  image: string;
  icon: MaterialIcon;
  fileUrl: string;
  sortOrder: number;
};

export type Project = {
  id?: number;
  slug: string;
  name: string;
  location: string;
  status: string;
  completion: string;
  image: string;
  logo: string;
  logo2: string;
  eyebrow: string;
  description: string;
  materials: Material[];
};

export const fallbackProjects: Project[] = [
  {
    slug: "iconic",
    name: "ICONIC RESIDENCES",
    location: "Al Reem Island, Abu Dhabi",
    status: "Now selling",
    completion: "Q4 2028",
    image: "/images/iconic/main.jpg",
    logo: "/images/iconic/iconic-logo.svg",
    logo2: "/images/iconic/iconic-logo2.svg",
    eyebrow: "Waterfront residences",
    description:
      "An exclusive branded residence designed by Italian icon Pininfarina.",
    materials: [
      {
        title: "Presentations",
        subtitle: "Digital presntations and broshures",
        type: "PDF",
        size: "18.4 MB",
        image: "/images/iconic/brochure.jpg",
        icon: "FileText",
        fileUrl: "",
        sortOrder: 1,
      },
      {
        title: "Renders",
        subtitle: "High-quality renders and visualizations",
        type: "ZIP",
        size: "148 MB",
        image: "/images/iconic/renders.jpg",
        icon: "Image",
        fileUrl: "",
        sortOrder: 2,
      },
      {
        title: "Show Apartment",
        subtitle: "Virtual tour of the show apartment",
        type: "PDF",
        size: "2.1 MB",
        image: "/images/iconic/apartments.jpg",
        icon: "Rotate3d",
        fileUrl: "",
        sortOrder: 3,
      },
      {
        title: "Videos",
        subtitle: "Project videos and walkthroughs",
        type: "ZIP",
        size: "46.8 MB",
        image: "/images/iconic/videos.jpg",
        icon: "Video",
        fileUrl: "",
        sortOrder: 4,
      },
      {
        title: "Views",
        subtitle: "Location views and panoramas",
        type: "PDF",
        size: "1.2 MB",
        image: "/images/iconic/view.jpg",
        icon: "Eye",
        fileUrl: "",
        sortOrder: 5,
      },
    ],
  },
  {
    slug: "riviera",
    name: "RIVIERA RESIDENCES",
    location: "Saadiyat Island, Abu Dhabi",
    status: "Exclusive release",
    completion: "Q2 2027",
    image: "/images/riviera/main.jpg",
    logo: "/images/riviera/riviera-logo.svg",
    logo2: "/images/riviera/riviera-logo2.svg",
    eyebrow: "Private beach collection",
    description:
      "Stunning waterfront residences with signature architecture and amenities.",
    materials: [
      {
        title: "Presentations",
        subtitle: "Digital presntations and broshures",
        type: "PDF",
        size: "24.6 MB",
        image: "/images/riviera/brochure.jpg",
        icon: "FileText",
        fileUrl: "",
        sortOrder: 1,
      },
      {
        title: "Renders",
        subtitle: "High-quality renders and visualizations",
        type: "PDF",
        size: "12.8 MB",
        image: "/images/riviera/renders.jpg",
        icon: "Image",
        fileUrl: "",
        sortOrder: 2,
      },
      {
        title: "Sales Gallery",
        subtitle: "Digital presntations and broshures",
        type: "ZIP",
        size: "38.2 MB",
        image: "/images/riviera/gallery.jpg",
        icon: "FileText",
        fileUrl: "",
        sortOrder: 3,
      },
      {
        title: "Videos",
        subtitle: "Project videos and walkthroughs",
        type: "XLSX",
        size: "840 KB",
        image: "/images/riviera/videos.jpg",
        icon: "Video",
        fileUrl: "",
        sortOrder: 4,
      },
    ],
  },
];

