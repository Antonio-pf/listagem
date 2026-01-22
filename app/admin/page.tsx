import { getAdminStats, getAllReservations, getAllGuests, getAllMessages, getEventResources } from '@/lib/admin-data-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Gift, MessageCircle, UserCheck, Armchair, Table2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [stats, reservations, guests, messages, eventResources] = await Promise.all([
    getAdminStats(),
    getAllReservations(),
    getAllGuests(),
    getAllMessages(),
    getEventResources()
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

      {/* Event Resources Card */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Table2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
            Relatório de Recursos do Evento
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
          <CardTitle className="text-base sm:text-lg">Reservas Recentes</CardTitle>
          {reservations.length > 0 && (
            <form action="/api/admin/export?type=reservations&format=csv" method="GET">
              <Button variant="outline" size="sm" type="submit" className="w-full sm:w-auto">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm">Exportar CSV</span>
              </Button>
            </form>
          )}
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">ID do Presente</th>
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">Convidado</th>
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">Tipo</th>
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">Valor</th>
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm hidden md:table-cell">Acompanhante</th>
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm hidden lg:table-cell">Data</th>
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 10).map((reservation) => (
                  <tr key={reservation.id} className="border-b">
                    <td className="py-2 px-2 sm:px-4 font-mono text-xs sm:text-sm">{reservation.gift_id.substring(0, 8)}...</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{reservation.guest_name}</td>
                    <td className="py-2 px-2 sm:px-4">
                      <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                        reservation.contribution_type === 'pix' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {reservation.contribution_type === 'pix' ? 'PIX' : 'Físico'}
                      </span>
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                      {reservation.gift_price 
                        ? `R$ ${reservation.gift_price.toFixed(2)}` 
                        : '-'}
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm hidden md:table-cell">{reservation.has_companion ? 'Sim' : 'Não'}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs text-muted-foreground hidden lg:table-cell">
                      {new Date(reservation.reserved_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
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
          <CardTitle className="text-base sm:text-lg">Convidados</CardTitle>
          {guests.length > 0 && (
            <form action="/api/admin/export?type=guests&format=csv" method="GET">
              <Button variant="outline" size="sm" type="submit" className="w-full sm:w-auto">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm">Exportar CSV</span>
              </Button>
            </form>
          )}
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">Nome</th>
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">Acompanhante</th>
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">Reservas</th>
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm hidden md:table-cell">Data de Registro</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id} className="border-b">
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{guest.name}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{guest.has_companion ? 'Sim' : 'Não'}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{guest.reservations_count}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs text-muted-foreground hidden md:table-cell">
                      {new Date(guest.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
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

      {/* Messages Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Mensagens</CardTitle>
          {messages.length > 0 && (
            <form action="/api/admin/export?type=messages&format=csv" method="GET">
              <Button variant="outline" size="sm" type="submit" className="w-full sm:w-auto">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm">Exportar CSV</span>
              </Button>
            </form>
          )}
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">Nome</th>
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm">Mensagem</th>
                  <th className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm hidden md:table-cell">Data</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="border-b">
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{message.guest_name}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm max-w-[200px] sm:max-w-md truncate">{message.message}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs text-muted-foreground hidden md:table-cell">
                      {new Date(message.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
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
