<template>
  <div>
    <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Referidos</h1>
        </div>

				<md-field class="md-toolbar-section-end" style="max-width: 80px;margin-right: 12px;">
					<md-select v-model="limit" name="limit" id="limit">
						<md-option value="1">1</md-option>
						<md-option value="5">5</md-option>
						<md-option value="10">10</md-option>
						<md-option value="25">25</md-option>
						<md-option value="50">50</md-option>
						<md-option :value="totalRows">Todos</md-option>
					</md-select>
				</md-field>
				<md-field md-clearable class="md-toolbar-section-end">
					<md-input placeholder="Buscar..." v-model="search" @input="searchOnTable" />
				</md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No users found"
        :md-description="`No user found for this '${search}' query. Try a different search term or create a new user.`">
        <md-button class="md-primary md-raised" @click="newUser">Create New User</md-button>
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
        <md-table-cell md-label="nombres" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="telefono" md-sort-by="gender">{{ item.phone}}</md-table-cell>
        <md-table-cell md-label="identificacion" md-sort-by="dni">{{ item.dni }}</md-table-cell>
      </md-table-row>
    </md-table>

    <dm-paginator v-bind:total="total" v-bind:limit="limit" @pageChanged="fetchUsers($event)"></dm-paginator>
  </div>
</template>

<script>
  const toLower = text => {
    return text.toString().toLowerCase()
  }

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.name).includes(toLower(term)))
    }

    return items
  }

  export default {
    name: 'TableSearch',
    data: () => ({
      search: null,
      searched: [],
      users: [
        {
          id: 1,
          name: "Shawna Dubbin",
          email: "sdubbin0@geocities.com",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 2,
          name: "Odette Demageard",
          email: "odemageard1@spotify.com",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 3,
          name: "Vera Taleworth",
          email: "vtaleworth2@google.ca",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 4,
          name: "Lonnie Izkovitz",
          email: "lizkovitz3@youtu.be",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 5,
          name: "Thatcher Stave",
          email: "tstave4@reference.com",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 6,
          name: "Karim Chipping",
          email: "kchipping5@scribd.com",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 7,
          name: "Shawna Dubbin",
          email: "sdubbin0@geocities.com",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 8,
          name: "Odette Demageard",
          email: "odemageard1@spotify.com",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 9,
          name: "Vera Taleworth",
          email: "vtaleworth2@google.ca",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 10,
          name: "Lonnie Izkovitz",
          email: "lizkovitz3@youtu.be",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 11,
          name: "Thatcher Stave",
          email: "tstave4@reference.com",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 12,
          name: "Karim Chipping",
          email: "kchipping5@scribd.com",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 13,
          name: "Shawna Dubbin",
          email: "sdubbin0@geocities.com",
          phone: "13314444",
          dni: "84918492"
        },
        {
          id: 14,
          name: "Odette Demageard",
          email: "odemageard1@spotify.com",
          phone: "13314444",
          dni: "84918492"
        }
      ],
      total: 0,
      limit: 1
    }),
    methods: {
      newUser () {
        window.alert('Noop')
      },
      searchOnTable () {
        this.searched = searchByName(this.users, this.search)
      },
      fetchUsers($event) {
        console.log($event);
        alert($event);
      }
    },
    created () {
      this.searched = this.users;
      this.total = this.users.length;
    }
  }
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
</style>
