import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { CurrencyCode, SplitBalanceDTO } from "../types"
import SettlementDialog from "./SettlementDialog"
import { useAppDispatch } from "@/app/hooks"
import { fetchGroupSummary, fetchGroupSplitBalances } from "../balanceSlice"
import { createSettlement } from "../expenseSlice"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errorUtils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
  debts: SplitBalanceDTO[]
  currentUserId?: string
  groupId: string
  currencyCode?: CurrencyCode
}

function OpenDebtsCard({ debts, currentUserId, groupId, currencyCode }: Props) {
  const dispatch = useAppDispatch()

  const [activeTab, setActiveTab] = useState<"mine" | "all">("mine")
  const [selectedDebt, setSelectedDebt] = useState<SplitBalanceDTO | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [settlingAll, setSettlingAll] = useState(false)

  const refreshBalances = () => {
    dispatch(fetchGroupSummary(groupId))
    dispatch(fetchGroupSplitBalances(groupId))
  }

  const handleSettleAll = async () => {
    setSettlingAll(true)
    try {
      for (const debt of myDebts) {
        await dispatch(
          createSettlement({
            expenseSplitId: debt.expenseSplitId,
            amount: debt.remainingDebt,
            currencyCode: debt.currencyCode,
            note: "Settled via Settle All",
          })
        ).unwrap()
      }
      refreshBalances()
      toast.success("All debts settled successfully!")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSettlingAll(false)
    }
  }

  const openDebts = useMemo(
    () => debts.filter((debt) => !debt.settled && debt.remainingDebt > 0),
    [debts]
  )

  const myDebts = openDebts.filter((debt) => debt.debtorId === currentUserId)

  const displayedDebts = activeTab === "all" ? openDebts : myDebts

  const myTotalDebt = myDebts.reduce((sum, debt) => sum + debt.remainingDebt, 0)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Open Debts</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "mine" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("mine")}
              >
                My Debts
              </Button>
              <Button
                variant={activeTab === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("all")}
              >
                All Debts
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {displayedDebts.length === 0 ? (
            <p className="text-muted-foreground">No open debts 🎉</p>
          ) : (
            <ScrollArea className="h-60">
              <div className="space-y-3 pr-4">
                {displayedDebts.map((debt) => (
                  <div
                    key={debt.expenseSplitId}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{debt.expenseTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {debt.debtorUsername}
                        {" → "}
                        {debt.creditorUsername}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>
                        {debt.remainingDebt} {debt.currencyCode}
                      </span>
                      {activeTab === "mine" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedDebt(debt)
                            setOpenDialog(true)
                          }}
                        >
                          Settle
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {activeTab === "mine" && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm text-muted-foreground">My Open Debt</p>
                <p className="font-semibold">
                  {myTotalDebt.toFixed(2)} {currencyCode}
                </p>
              </div>
              {myDebts.length > 0 && (
                <Button onClick={handleSettleAll} disabled={settlingAll}>
                  {settlingAll ? "Settling..." : "Settle All"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedDebt && (
        <SettlementDialog
          debt={selectedDebt}
          open={openDialog}
          onOpenChange={setOpenDialog}
          onSuccess={refreshBalances}
        />
      )}
    </>
  )
}

export default OpenDebtsCard
