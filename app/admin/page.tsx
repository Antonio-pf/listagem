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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Convidados</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.guestsWithCompanions} com acompanhantes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presentes Reservados</CardTitle>
            <Gift className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reservedGiftsPercentage}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Recebidas até agora
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acompanhantes</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.guestsWithCompanions}</div>
            <p className="text-xs text-muted-foreground">
              Convidados com +1
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Event Resources Card */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="h-5 w-5 text-indigo-500" />
            Relatório de Recursos do Evento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total de Pessoas</p>
              <p className="text-2xl font-bold text-indigo-600">{eventResources.totalPeople}</p>
              <p className="text-xs text-muted-foreground">Convidados + Acompanhantes</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Table2 className="h-4 w-4" />
                Mesas Necessárias
              </p>
              <p className="text-2xl font-bold text-indigo-600">{eventResources.tablesNeeded}</p>
              <p className="text-xs text-muted-foreground">4 pessoas por mesa</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Armchair className="h-4 w-4" />
                Cadeiras Necessárias
              </p>
              <p className="text-2xl font-bold text-indigo-600">{eventResources.chairsNeeded}</p>
              <p className="text-xs text-muted-foreground">1 por pessoa</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pratos e Copos</p>
              <p className="text-2xl font-bold text-indigo-600">{eventResources.platesNeeded}</p>
              <p className="text-xs text-muted-foreground">1 jogo por pessoa</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      {/* Reservations Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Reservas Recentes</CardTitle>
          <form action="/api/admin/export?type=reservations&format=csv" method="GET">
            <Button variant="outline" size="sm" type="submit">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">ID do Presente</th>
                  <th className="text-left py-2 px-4">Convidado</th>
                  <th className="text-left py-2 px-4">Tipo</th>
                  <th className="text-left py-2 px-4">Valor</th>
                  <th className="text-left py-2 px-4">Acompanhante</th>
                  <th className="text-left py-2 px-4">Data</th>
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 10).map((reservation) => (
                  <tr key={reservation.id} className="border-b">
                    <td className="py-2 px-4 font-mono text-sm">{reservation.gift_id}</td>
                    <td className="py-2 px-4">{reservation.guest_name}</td>
                    <td className="py-2 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        reservation.contribution_type === 'pix' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {reservation.contribution_type === 'pix' ? 'PIX' : 'Presente Físico'}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {reservation.gift_price 
                        ? `R$ ${reservation.gift_price.toFixed(2)}` 
                        : '-'}
                    </td>
                    <td className="py-2 px-4">{reservation.has_companion ? 'Sim' : 'Não'}</td>
                    <td className="py-2 px-4 text-sm text-muted-foreground">
                      {new Date(reservation.reserved_at).toLocaleString('pt-BR')}
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Convidados</CardTitle>
          <form action="/api/admin/export?type=guests&format=csv" method="GET">
            <Button variant="outline" size="sm" type="submit">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Nome</th>
                  <th className="text-left py-2 px-4">Acompanhante</th>
                  <th className="text-left py-2 px-4">Reservas</th>
                  <th className="text-left py-2 px-4">Data de Registro</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id} className="border-b">
                    <td className="py-2 px-4">{guest.name}</td>
                    <td className="py-2 px-4">{guest.has_companion ? 'Sim' : 'Não'}</td>
                    <td className="py-2 px-4">{guest.reservations_count}</td>
                    <td className="py-2 px-4 text-sm text-muted-foreground">
                      {new Date(guest.created_at).toLocaleString('pt-BR')}
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Mensagens</CardTitle>
          <form action="/api/admin/export?type=messages&format=csv" method="GET">
            <Button variant="outline" size="sm" type="submit">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Nome</th>
                  <th className="text-left py-2 px-4">Mensagem</th>
                  <th className="text-left py-2 px-4">Data</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="border-b">
                    <td className="py-2 px-4">{message.guest_name}</td>
                    <td className="py-2 px-4 max-w-md truncate">{message.message}</td>
                    <td className="py-2 px-4 text-sm text-muted-foreground">
                      {new Date(message.created_at).toLocaleString('pt-BR')}
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
