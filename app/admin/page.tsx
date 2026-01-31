import { getAdminStats, getAllReservations, getAllGuests, getAllMessages, getEventResources, getAllAttendances, getPendingConfirmationGuests } from '@/lib/admin-data-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Gift, MessageCircle, UserCheck, Armchair, Table2, AlertCircle } from 'lucide-react'
import { ExportButton } from '@/components/export-button'
import { formatBrazilDate } from '@/lib/utils'
import { PendingGuestsModal } from '@/components/pending-guests-modal'
import { Button } from '@/components/ui/button'

// Disable caching for real-time data updates
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
  const [stats, reservations, guests, messages, eventResources, attendances, pendingGuests] = await Promise.all([
    getAdminStats(),
    getAllReservations(),
    getAllGuests(),
    getAllMessages(),
    getEventResources(),
    getAllAttendances(),
    getPendingConfirmationGuests()
  ])

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total de Convidados</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold">{stats.totalGuests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.guestsWithCompanions} com acompanhantes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Presentes Reservados</CardTitle>
            <Gift className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold">{stats.totalReservations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reservedGiftsPercentage}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Mensagens</CardTitle>
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Recebidas até agora
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Acompanhantes</CardTitle>
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-xl sm:text-2xl font-bold">{stats.guestsWithCompanions}</div>
            <p className="text-xs text-muted-foreground">
              Convidados com +1
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Confirmation Statistics Card */}
      <Card className="border-l-4 border-l-teal-500">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-serif">
            <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />
            <span>Confirmações de Presença</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Confirmado</p>
              <p className="text-xl sm:text-2xl font-bold text-teal-600">{stats.totalAttendanceConfirmed}</p>
              <p className="text-xs text-muted-foreground">
                {stats.totalGuests > 0 ? Math.round((stats.totalAttendanceConfirmed / stats.totalGuests) * 100) : 0}% dos convidados
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Confirmou Presença</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.totalAttending}</p>
              <p className="text-xs text-muted-foreground">
                {stats.totalAttendanceConfirmed > 0 ? Math.round((stats.totalAttending / stats.totalAttendanceConfirmed) * 100) : 0}% das confirmações
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Não Comparecerá</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.totalNotAttending}</p>
              <p className="text-xs text-muted-foreground">
                {stats.totalAttendanceConfirmed > 0 ? Math.round((stats.totalNotAttending / stats.totalAttendanceConfirmed) * 100) : 0}% das confirmações
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Pendente</p>
              <div className="flex items-center gap-2">
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.totalPendingConfirmation}</p>
                {stats.totalPendingConfirmation > 0 && (
                  <PendingGuestsModal
                    pendingGuests={pendingGuests}
                    trigger={
                      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-yellow-100 dark:hover:bg-yellow-900/30">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      </Button>
                    }
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalGuests > 0 ? Math.round((stats.totalPendingConfirmation / stats.totalGuests) * 100) : 0}% dos convidados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Resources Card */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-serif">
            <Table2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
            <span className="hidden sm:inline">Relatório de Recursos do Evento</span>
            <span className="sm:hidden">Recursos do Evento</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Total de Pessoas</p>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600">{eventResources.totalPeople}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">Convidados + Acompanhantes</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                <Table2 className="h-3 w-3 sm:h-4 sm:w-4" />
                Mesas Necessárias
              </p>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600">{eventResources.tablesNeeded}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">4 pessoas por mesa</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                <Armchair className="h-3 w-3 sm:h-4 sm:w-4" />
                Cadeiras Necessárias
              </p>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600">{eventResources.chairsNeeded}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">1 por pessoa</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Pratos e Copos</p>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600">{eventResources.platesNeeded}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">1 jogo por pessoa</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-serif">Reservas Recentes</CardTitle>
          {reservations.length > 0 && (
            <ExportButton type="reservations" className="w-full sm:w-auto" />
          )}
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Convidado</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Valor</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Acompanhante</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Data</th>
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 10).map((reservation) => (
                  <tr key={reservation.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-3 text-sm">{reservation.guest_name}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        reservation.contribution_type === 'pix' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {reservation.contribution_type === 'pix' ? 'PIX' : 'Físico'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm font-medium">
                      {reservation.gift_price 
                        ? `R$ ${reservation.gift_price.toFixed(2)}` 
                        : '-'}
                    </td>
                    <td className="py-3 px-3 text-sm hidden md:table-cell">{reservation.has_companion ? 'Sim' : 'Não'}</td>
                    <td className="py-3 px-3 text-xs text-muted-foreground hidden lg:table-cell">
                      {formatBrazilDate(reservation.reserved_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservations.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma reserva ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Guests Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-serif">Convidados</CardTitle>
          {guests.length > 0 && (
            <ExportButton type="guests" className="w-full sm:w-auto" />
          )}
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Nome</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Acompanhante</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Presentes</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Data de Registro</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-3 text-sm">{guest.name}</td>
                    <td className="py-3 px-3 text-sm">{guest.has_companion ? 'Sim' : 'Não'}</td>
                    <td className="py-3 px-3 text-sm">
                      {guest.gifts.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {guest.gifts.map((gift, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full inline-block">
                              {gift}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-xs text-muted-foreground hidden md:table-cell">
                      {formatBrazilDate(guest.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {guests.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum convidado ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Confirmations Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-serif">Confirmações de Presença</CardTitle>
          {attendances.length > 0 && (
            <ExportButton type="attendances" className="w-full sm:w-auto" />
          )}
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Nome</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Confirmou</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Mensagem</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Data</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((attendance) => (
                  <tr key={attendance.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-3 text-sm">{attendance.guest_name}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        attendance.will_attend 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {attendance.will_attend ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm max-w-[200px] sm:max-w-md truncate hidden md:table-cell">
                      {attendance.additional_notes || '-'}
                    </td>
                    <td className="py-3 px-3 text-xs text-muted-foreground hidden lg:table-cell">
                      {formatBrazilDate(attendance.confirmed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attendances.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma confirmação ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-serif">Mensagens</CardTitle>
          {messages.length > 0 && (
            <ExportButton type="messages" className="w-full sm:w-auto" />
          )}
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Nome</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Mensagem</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Data</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-3 text-sm">{message.guest_name}</td>
                    <td className="py-3 px-3 text-sm max-w-[200px] sm:max-w-md truncate">{message.message}</td>
                    <td className="py-3 px-3 text-xs text-muted-foreground hidden md:table-cell">
                      {formatBrazilDate(message.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma mensagem ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
