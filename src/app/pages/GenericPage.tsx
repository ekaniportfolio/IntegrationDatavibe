import { useTranslation } from "../components/language-provider"

export const GenericPage = ({ title }: { title: string }) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">{t("common.construction")}</p>
          <p className="text-muted-foreground/60 text-sm mt-2">{t("common.planned")}</p>
        </div>
      </div>
    </div>
  )
}