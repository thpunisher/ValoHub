import { getWeapon, getWeapons } from "@/lib/valorant-api"
import { WeaponDetail } from "@/components/weapons/weapon-detail"
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface WeaponPageProps {
  params: Promise<{ uuid: string }>
}

export async function generateMetadata({ params }: WeaponPageProps): Promise<Metadata> {
  const { uuid } = await params
  try {
    const weapon = await getWeapon(uuid)
    return {
      title: `${weapon.displayName} | Weapons | VALOBASE`,
      description: `Explore ${weapon.displayName} stats, damage values, and skins in Valorant.`
    }
  } catch {
    return {
      title: "Weapon Not Found | VALOBASE"
    }
  }
}

export async function generateStaticParams() {
  const weapons = await getWeapons()
  return weapons.map((weapon) => ({
    uuid: weapon.uuid,
  }))
}

export default async function WeaponPage({ params }: WeaponPageProps) {
  const { uuid } = await params
  
  try {
    const weapon = await getWeapon(uuid)
    return <WeaponDetail weapon={weapon} />
  } catch {
    notFound()
  }
}
