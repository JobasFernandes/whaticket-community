const messages = {
  pt: {
    translations: {
      signup: {
        title: "Cadastre-se",
        toasts: {
          success: "Usuário criado com sucesso! Faça seu login!!!.",
          fail: "Erro ao criar usuário. Verifique os dados informados."
        },
        form: {
          name: "Nome",
          email: "Email",
          password: "Senha"
        },
        buttons: {
          submit: "Cadastrar",
          login: "Já tem uma conta? Entre!"
        }
      },
      login: {
        title: "Login",
        form: {
          email: "Email",
          password: "Senha"
        },
        buttons: {
          submit: "Entrar",
          register: "Não tem um conta? Cadastre-se!"
        }
      },
      auth: {
        toasts: {
          success: "Login efetuado com sucesso!"
        }
      },
      dashboard: {
        title: "Dashboard",
        subtitle: "Visão geral do sistema de atendimento",
        periods: {
          lastMonth: "Mês Anterior",
          lastWeek: "Semana Anterior",
          yesterday: "Ontem",
          today: "Hoje",
          week: "Semana Atual",
          month: "Mês Atual",
          all: "Todo o Período"
        },
        charts: {
          perDay: {
            title: "Tickets hoje: "
          },
          ticketsByHour: {
            title: "Tickets por Horário",
            subtitle: "Distribuição ao longo do dia",
            tooltip: {
              time: "Horário",
              tickets: "Tickets"
            }
          }
        },
        messages: {
          inAttendance: {
            title: "Em Atendimento"
          },
          waiting: {
            title: "Aguardando"
          },
          closed: {
            title: "Finalizado"
          },
          total: {
            title: "Total de Tickets"
          }
        },
        quickStats: {
          title: "Resumo Rápido",
          resolutionRate: "Taxa de Resolução",
          inService: "Tickets em Atendimento",
          waiting: "Tickets Aguardando"
        },
        userStats: {
          title: "Tickets por Usuário",
          opened: "abertos",
          closed: "fechados",
          tickets: "tickets",
          noData: "Nenhum atendimento encontrado"
        },
        loading: "Carregando..."
      },
      connections: {
        title: "Conexões",
        toasts: {
          deleted: "Conexão com o WhatsApp excluída com sucesso!"
        },
        confirmationModal: {
          deleteTitle: "Deletar",
          deleteMessage: "Você tem certeza? Essa ação não pode ser revertida.",
          disconnectTitle: "Desconectar",
          disconnectMessage:
            "Tem certeza? Você precisará ler o QR Code novamente."
        },
        buttons: {
          add: "Adicionar WhatsApp",
          disconnect: "desconectar",
          tryAgain: "Tentar novamente",
          qrcode: "QR CODE",
          newQr: "Novo QR CODE",
          connecting: "Conectando"
        },
        tooltips: {
          qrCode: "QR Code",
          start: "Iniciar",
          disconnect: "Desconectar",
          restart: "Reiniciar",
          edit: "Editar",
          delete: "Excluir"
        },
        toolTips: {
          disconnected: {
            title: "Falha ao iniciar sessão do WhatsApp",
            content:
              "Certifique-se de que seu celular esteja conectado à internet e tente novamente, ou solicite um novo QR Code"
          },
          qrcode: {
            title: "Esperando leitura do QR Code",
            content:
              "Clique no botão 'QR CODE' e leia o QR Code com o seu celular para iniciar a sessão"
          },
          connected: {
            title: "Conexão estabelecida!"
          },
          timeout: {
            title: "A conexão com o celular foi perdida",
            content:
              "Certifique-se de que seu celular esteja conectado à internet e o WhatsApp esteja aberto, ou clique no botão 'Desconectar' para obter um novo QR Code"
          }
        },
        table: {
          name: "Nome",
          status: "Status",
          lastUpdate: "Última atualização",
          default: "Padrão",
          actions: "Ações",
          session: "Sessão",
          number: "Número"
        },
        status: {
          CONNECTED: "Conectado",
          DISCONNECTED: "Desconectado",
          qrcode: "QR Code",
          OPENING: "Abrindo",
          PAIRING: "Pareando",
          TIMEOUT: "Timeout"
        }
      },
      whatsappModal: {
        title: {
          add: "Adicionar WhatsApp",
          edit: "Editar WhatsApp"
        },
        form: {
          name: "Nome",
          default: "Padrão",
          mainInfo: "Informações Principais",
          greetingMessage: "Mensagem de saudação",
          farewellMessage: "Mensagem de despedida",
          queues: "Filas"
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
          saving: "Salvando..."
        },
        success: "WhatsApp salvo com sucesso."
      },
      queueSelect: {
        placeholder: "Selecionar filas...",
        selectedSingle: "fila selecionada",
        selectedPlural: "filas selecionadas",
        noQueues: "Nenhuma fila disponível"
      },
      common: {
        mainInfo: "Informações Principais",
        messages: "Mensagens",
        queueSection: "Filas de Atendimento",
        defaultWhatsApp: "Definir como WhatsApp padrão",
        edit: "Editar",
        delete: "Excluir",
        save: "Salvar",
        cancel: "Cancelar"
      },
      qrCode: {
        message: "Leia o QrCode para iniciar a sessão",
        title: "Conectar WhatsApp",
        loading: "Gerando QR Code...",
        scanInstruction: "Escaneie o QR Code para conectar",
        waiting: "Aguardando QR Code...",
        stepsTitle: "Etapas para acessar",
        step1Title: "Abra o WhatsApp",
        step1Description: "no seu celular",
        step2Title: "Toque em Mais opções",
        step2Description: "no Android ou em Configurações no iPhone",
        step3Title: "Toque em Dispositivos conectados",
        step3Description: "e, em seguida, em Conectar dispositivo",
        step4Title: "Escaneie o QR Code",
        step4Description: "para confirmar",
        securityNote:
          "Mantenha seu telefone conectado à internet para sincronizar as mensagens."
      },
      contacts: {
        title: "Contatos",
        toasts: {
          deleted: "Contato excluído com sucesso!"
        },
        searchPlaceholder: "Pesquisar...",
        confirmationModal: {
          deleteTitle: "Deletar ",
          importTitlte: "Importar contatos",
          deleteMessage:
            "Tem certeza que deseja deletar este contato? Todos os tickets relacionados serão perdidos.",
          importMessage: "Deseja importas todos os contatos do telefone?"
        },
        buttons: {
          import: "Importar Contatos",
          add: "Adicionar Contato"
        },
        table: {
          name: "Nome",
          whatsapp: "WhatsApp",
          email: "Email",
          actions: "Ações"
        },
        tooltips: {
          createTicket: "Criar ticket",
          editContact: "Editar contato",
          deleteContact: "Excluir contato"
        }
      },
      contactModal: {
        title: {
          add: "Adicionar contato",
          edit: "Editar contato"
        },
        form: {
          mainInfo: "Dados do contato",
          extraInfo: "Informações adicionais",
          name: "Nome",
          number: "Número do Whatsapp",
          email: "Email",
          extraName: "Nome do campo",
          extraValue: "Valor"
        },
        buttons: {
          addExtraInfo: "Adicionar informação",
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar"
        },
        success: "Contato salvo com sucesso."
      },
      quickAnswersModal: {
        title: {
          add: "Adicionar Resposta Rápida",
          edit: "Editar Resposta Rápida"
        },
        form: {
          mainInfo: "Informações Principais",
          shortcut: "Atalho",
          message: "Resposta Rápida"
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar"
        },
        success: "Resposta Rápida salva com sucesso."
      },
      queueModal: {
        title: {
          add: "Adicionar fila",
          edit: "Editar fila"
        },
        form: {
          mainInfo: "Informações da Fila",
          name: "Nome",
          color: "Cor",
          greetingMessage: "Mensagem de saudação"
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar"
        },
        success: "Fila salva com sucesso."
      },
      userModal: {
        title: {
          add: "Adicionar usuário",
          edit: "Editar usuário"
        },
        form: {
          mainInfo: "Informações Principais",
          name: "Nome",
          email: "Email",
          password: "Senha",
          profile: "Perfil",
          whatsapp: "Conexão Padrão",
          queues: "Filas de Atendimento"
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar"
        },
        success: "Usuário salvo com sucesso."
      },
      chat: {
        noTicketMessage: "Selecione um ticket para começar a conversar."
      },
      ticketsManager: {
        buttons: {
          newTicket: "Novo"
        }
      },
      ticketsQueueSelect: {
        placeholder: "Filas",
        noQueues: "Nenhuma fila disponível",
        filterTitle: "Filtrar por filas",
        queue: "fila",
        queues: "filas"
      },
      tickets: {
        toasts: {
          deleted: "O ticket que você estava foi deletado."
        },
        notification: {
          message: "Mensagem de"
        },
        tabs: {
          open: { title: "Inbox" },
          closed: { title: "Resolvidos" },
          search: { title: "Busca" }
        },
        search: {
          placeholder: "Buscar tickets e mensagens"
        },
        buttons: {
          showAll: "Todos"
        }
      },
      transferTicketModal: {
        title: "Transferir Ticket",
        fieldLabel: "Digite para buscar usuários",
        fieldQueueLabel: "Transferir para fila",
        fieldConnectionLabel: "Transferir para conexão",
        fieldQueuePlaceholder: "Selecione uma fila",
        fieldConnectionPlaceholder: "Selecione uma conexão",
        noOptions: "Nenhum usuário encontrado com esse nome",
        buttons: {
          ok: "Transferir",
          cancel: "Cancelar"
        }
      },
      ticketsList: {
        pendingHeader: "Aguardando",
        assignedHeader: "Atendendo",
        noTicketsTitle: "Nada aqui!",
        noTicketsMessage:
          "Nenhum ticket encontrado com esse status ou termo pesquisado",
        connectionTitle: "Conexão que está sendo utilizada atualmente.",
        status: {
          pending: "Pendente",
          closed: "Fechado",
          open: "Aberto"
        },
        messages: {
          pending: "Aguardando atendimento",
          noMessages: "Sem mensagens"
        },
        buttons: {
          accept: "Aceitar",
          resolve: "Resolver"
        }
      },
      newTicketModal: {
        title: "Criar Ticket",
        fieldLabel: "Digite para pesquisar o contato",
        add: "Adicionar",
        queue: "Fila",
        selectQueue: "Selecione uma fila",
        connection: "Conexão",
        selectConnection: "Selecione uma conexão",
        contact: "Contato",
        buttons: {
          ok: "Salvar",
          cancel: "Cancelar"
        }
      },
      acceptTicketModal: {
        title: "Aceitar Ticket",
        description:
          "Para aceitar este ticket, você deve selecionar uma fila primeiro.",
        queue: "Fila",
        selectQueue: "Selecione uma fila",
        buttons: {
          accept: "Aceitar Ticket",
          cancel: "Cancelar"
        }
      },
      mainDrawer: {
        listItems: {
          attendances: "Atendimentos",
          administration: "Administração",
          dashboard: "Dashboard",
          connections: "Conexões",
          tickets: "Tickets",
          contacts: "Contatos",
          quickAnswers: "Respostas Rápidas",
          queues: "Filas",
          users: "Usuários",
          settings: "Configurações"
        },
        appBar: {
          user: {
            profile: "Perfil",
            logout: "Sair"
          }
        },
        tooltips: {
          theme: "Alternar tema",
          notifications: "Notificações",
          language: "Alterar idioma",
          profile: "Perfil do usuário",
          logout: "Sair",
          menu: "Abrir menu",
          connectionAlert: "Há conexões desconectadas - Clique para gerenciar",
          themeLight: "Modo Claro",
          themeDark: "Modo Escuro",
          languageSection: "Idioma"
        }
      },
      notifications: {
        title: "Notificações",
        noTickets: "Nenhuma notificação."
      },
      queues: {
        title: "Filas",
        table: {
          name: "Nome",
          color: "Cor",
          greeting: "Mensagem de saudação",
          actions: "Ações"
        },
        buttons: {
          add: "Adicionar fila"
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage:
            "Você tem certeza? Essa ação não pode ser revertida! Os tickets dessa fila continuarão existindo, mas não terão mais nenhuma fila atribuída.",
          success: "Fila excluída com sucesso."
        }
      },
      quickAnswers: {
        title: "Respostas Rápidas",
        table: {
          shortcut: "Atalho",
          message: "Resposta Rápida",
          actions: "Ações"
        },
        buttons: {
          add: "Adicionar Resposta Rápida"
        },
        tooltips: {
          editQuickAnswer: "Editar resposta rápida",
          deleteQuickAnswer: "Excluir resposta rápida"
        },
        toasts: {
          deleted: "Resposta Rápida excluída com sucesso."
        },
        searchPlaceholder: "Pesquisar...",
        confirmationModal: {
          deleteTitle:
            "Você tem certeza que quer excluir esta Resposta Rápida: ",
          deleteMessage: "Esta ação não pode ser revertida."
        }
      },
      users: {
        title: "Usuários",
        table: {
          name: "Nome",
          email: "Email",
          profile: "Perfil",
          whatsapp: "Conexão Padrão",
          actions: "Ações"
        },
        buttons: {
          add: "Adicionar usuário"
        },
        toasts: {
          deleted: "Usuário excluído com sucesso."
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage:
            "Todos os dados do usuário serão perdidos. Os tickets abertos deste usuário serão movidos para a fila."
        }
      },
      settings: {
        success: "Configurações salvas com sucesso.",
        title: "Configurações",
        loading: "Carregando configurações...",
        apiToken: {
          title: "Token da API",
          description:
            "Token para acesso à API do sistema. Mantenha este token seguro e não o compartilhe.",
          placeholder: "Carregando token...",
          copyButton: "Copiar token",
          copySuccess: "Token copiado para a área de transferência!",
          copyError: "Erro ao copiar token",
          securityTitle: "Segurança Importante",
          securityDescription:
            "Este token permite acesso total à API. Não compartilhe com terceiros e mantenha-o seguro."
        },
        settings: {
          userCreation: {
            name: "Criação de usuário",
            description:
              "Controla se novos usuários podem se registrar no sistema",
            options: {
              enabled: "Ativado",
              disabled: "Desativado"
            }
          }
        }
      },
      messagesList: {
        header: {
          assignedTo: "Atribuído à:",
          buttons: {
            return: "Retornar",
            resolve: "Resolver",
            reopen: "Reabrir",
            accept: "Aceitar"
          }
        },
        deletedMessage: "Esta mensagem foi excluída"
      },
      messagesInput: {
        placeholderOpen: "Digite ou tecle ''/''",
        placeholderClosed: "Reabra ou aceite esse ticket",
        signMessage: "Assinar"
      },
      contactDrawer: {
        header: "Dados do contato",
        buttons: {
          edit: "Editar contato"
        },
        extraInfo: "Outras informações"
      },
      ticketOptionsMenu: {
        delete: "Deletar",
        transfer: "Transferir",
        confirmationModal: {
          title: "Deletar o ticket do contato",
          message:
            "Atenção! Todas as mensagens relacionadas ao ticket serão perdidas."
        },
        buttons: {
          delete: "Excluir",
          cancel: "Cancelar"
        }
      },
      confirmationModal: {
        buttons: {
          confirm: "Ok",
          cancel: "Cancelar"
        }
      },
      messageOptionsMenu: {
        delete: "Deletar",
        reply: "Responder",
        confirmationModal: {
          title: "Apagar mensagem?",
          message: "Esta ação não pode ser revertida."
        }
      },
      errorBoundary: {
        title: "Algo deu errado",
        message: "Ocorreu um erro inesperado. Por favor, recarregue a página.",
        button: "Recarregar página"
      },
      backendErrors: {
        ERR_NO_OTHER_WHATSAPP: "Deve haver pelo menos um WhatsApp padrão.",
        ERR_NO_DEF_WAPP_FOUND:
          "Nenhum WhatsApp padrão encontrado. Verifique a página de conexões.",
        ERR_WAPP_NOT_INITIALIZED:
          "Esta sessão do WhatsApp não foi inicializada. Verifique a página de conexões.",
        ERR_WAPP_CHECK_CONTACT:
          "Não foi possível verificar o contato do WhatsApp. Verifique a página de conexões",
        ERR_WAPP_INVALID_CONTACT: "Este não é um número de Whatsapp válido.",
        ERR_WAPP_DOWNLOAD_MEDIA:
          "Não foi possível baixar mídia do WhatsApp. Verifique a página de conexões.",
        ERR_INVALID_CREDENTIALS:
          "Erro de autenticação. Por favor, tente novamente.",
        ERR_SENDING_WAPP_MSG:
          "Erro ao enviar mensagem do WhatsApp. Verifique a página de conexões.",
        ERR_DELETE_WAPP_MSG: "Não foi possível excluir a mensagem do WhatsApp.",
        ERR_OTHER_OPEN_TICKET: "Já existe um tíquete aberto para este contato.",
        ERR_SESSION_EXPIRED: "Sessão expirada. Por favor entre.",
        ERR_USER_CREATION_DISABLED:
          "A criação do usuário foi desabilitada pelo administrador.",
        ERR_NO_PERMISSION: "Você não tem permissão para acessar este recurso.",
        ERR_DUPLICATED_CONTACT: "Já existe um contato com este número.",
        ERR_NO_SETTING_FOUND: "Nenhuma configuração encontrada com este ID.",
        ERR_NO_CONTACT_FOUND: "Nenhum contato encontrado com este ID.",
        ERR_NO_TICKET_FOUND: "Nenhum tíquete encontrado com este ID.",
        ERR_NO_USER_FOUND: "Nenhum usuário encontrado com este ID.",
        ERR_NO_WAPP_FOUND: "Nenhum WhatsApp encontrado com este ID.",
        ERR_CREATING_MESSAGE: "Erro ao criar mensagem no banco de dados.",
        ERR_CREATING_TICKET: "Erro ao criar tíquete no banco de dados.",
        ERR_FETCH_WAPP_MSG:
          "Erro ao buscar a mensagem no WhtasApp, talvez ela seja muito antiga.",
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          "Esta cor já está em uso, escolha outra.",
        ERR_WAPP_GREETING_REQUIRED:
          "A mensagem de saudação é obrigatório quando há mais de uma fila."
      }
    }
  }
};

export { messages };
