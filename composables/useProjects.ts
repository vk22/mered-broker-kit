export type Material = {
  title: string
  type: string
  size: string
  image: string
}

export type Project = {
  slug: string
  name: string
  location: string
  status: string
  completion: string
  image: string
  logo: string
  logo2: string
  eyebrow: string
  description: string
  materials: Material[]
}

const projects: Project[] = [
  {
    slug: 'mered-bay',
    name: 'ICONIC RESIDENCES',
    location: 'Al Reem Island, Abu Dhabi',
    status: 'Now selling',
    completion: 'Q4 2028',
    image: '/images/iconic/main.jpg',
    logo: '/images/iconic/iconic-logo.svg',
    logo2: '/images/iconic/iconic-logo2.svg',
    eyebrow: 'Waterfront residences',
    description: 'An exclusive branded residence designed by Italian icon Pininfarina.',
    materials: [
      { title: 'Presentations', type: 'PDF', size: '18.4 MB', image: '/images/iconic/brochure.jpg' },
      { title: 'Renders', type: 'ZIP', size: '148 MB', image: '/images/iconic/renders.jpg' },
      { title: 'Show Apartment', type: 'PDF', size: '2.1 MB', image: '/images/iconic/apartments.jpg' },
      { title: 'Videos', type: 'ZIP', size: '46.8 MB', image: '/images/iconic/videos.jpg' },
      { title: 'Views', type: 'PDF', size: '1.2 MB', image: '/images/iconic/view.jpg' },
    ]
  },
  {
    slug: 'azure-residences',
    name: 'RIVIERA RESIDENCES',
    location: 'Saadiyat Island, Abu Dhabi',
    status: 'Exclusive release',
    completion: 'Q2 2027',
    image: '/images/riviera/main.jpg',
    logo: '/images/riviera/riviera-logo.svg',
    logo2: '/images/riviera/riviera-logo2.svg',
    eyebrow: 'Private beach collection',
    description: 'Stunning waterfront residences with signature architecture and amenities.',
    materials: [
      { title: 'Presentations', type: 'PDF', size: '24.6 MB', image: '/images/riviera/brochure.jpg' },
      { title: 'Renders', type: 'PDF', size: '12.8 MB', image: '/images/riviera/renders.jpg' },
      { title: 'Sales Gallery', type: 'ZIP', size: '38.2 MB', image: '/images/riviera/gallery.jpg' },
      { title: 'Videos', type: 'XLSX', size: '840 KB', image: '/images/riviera/videos.jpg' }
    ]
  }
]

export const useProjects = () => projects

export const useProject = (slug: string) =>
  projects.find(project => project.slug === slug)
