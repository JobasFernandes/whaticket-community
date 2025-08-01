const messages = {
  en: {
    translations: {
      signup: {
        title: "Sign up",
        toasts: {
          success: "User created successfully! Please login!",
          fail: "Error creating user. Check the reported data."
        },
        form: {
          name: "Name",
          email: "Email",
          password: "Password"
        },
        buttons: {
          submit: "Register",
          login: "Already have an account? Log in!"
        }
      },
      login: {
        title: "Login",
        form: {
          email: "Email",
          password: "Password"
        },
        buttons: {
          submit: "Enter",
          register: "Don't have an account? Register!"
        }
      },
      auth: {
        toasts: {
          success: "Login successfully!"
        }
      },
      dashboard: {
        title: "Dashboard",
        subtitle: "System overview",
        periods: {
          lastMonth: "Last Month",
          lastWeek: "Last Week",
          yesterday: "Yesterday",
          today: "Today",
          week: "Current Week",
          month: "Current Month",
          all: "All Period"
        },
        charts: {
          perDay: {
            title: "Tickets today: "
          },
          ticketsByHour: {
            title: "Tickets by Hour",
            subtitle: "Distribution throughout the day",
            tooltip: {
              time: "Time",
              tickets: "Tickets"
            }
          }
        },
        messages: {
          inAttendance: {
            title: "In Service"
          },
          waiting: {
            title: "Waiting"
          },
          closed: {
            title: "Closed"
          },
          total: {
            title: "Total Tickets"
          }
        },
        quickStats: {
          title: "Quick Summary",
          resolutionRate: "Resolution Rate",
          inService: "Tickets in Service",
          waiting: "Tickets Waiting"
        },
        userStats: {
          title: "Tickets by User",
          opened: "open",
          closed: "closed",
          tickets: "tickets",
          noData: "No service found"
        },
        loading: "Loading..."
      },
      connections: {
        title: "Connections",
        toasts: {
          deleted: "WhatsApp connection deleted sucessfully!"
        },
        confirmationModal: {
          deleteTitle: "Delete",
          deleteMessage: "Are you sure? It cannot be reverted.",
          disconnectTitle: "Disconnect",
          disconnectMessage: "Are you sure? You'll need to read QR Code again."
        },
        buttons: {
          add: "Add WhatsApp",
          disconnect: "Disconnect",
          tryAgain: "Try Again",
          qrcode: "QR CODE",
          newQr: "New QR CODE",
          connecting: "Connectiing"
        },
        toolTips: {
          disconnected: {
            title: "Failed to start WhatsApp session",
            content:
              "Make sure your cell phone is connected to the internet and try again, or request a new QR Code"
          },
          qrcode: {
            title: "Waiting for QR Code read",
            content:
              "Click on 'QR CODE' button and read the QR Code with your cell phone to start session"
          },
          connected: {
            title: "Connection established"
          },
          timeout: {
            title: "Connection with cell phone has been lost",
            content:
              "Make sure your cell phone is connected to the internet and WhatsApp is open, or click on 'Disconnect' button to get a new QRcode"
          }
        },
        table: {
          name: "Name",
          status: "Status",
          lastUpdate: "Last Update",
          default: "Default",
          actions: "Actions",
          session: "Session",
          number: "Number"
        },
        status: {
          CONNECTED: "Connected",
          DISCONNECTED: "Disconnected",
          qrcode: "QR Code",
          OPENING: "Opening",
          PAIRING: "Pairing",
          TIMEOUT: "Timeout"
        }
      },
      whatsappModal: {
        title: {
          add: "Add WhatsApp",
          edit: "Edit WhatsApp"
        },
        form: {
          name: "Name",
          default: "Default",
          mainInfo: "Main Information",
          greetingMessage: "Greeting Message",
          farewellMessage: "Farewell Message",
          queues: "Queues of Attendance"
        },
        buttons: {
          okAdd: "Add",
          okEdit: "Save",
          cancel: "Cancel",
          saving: "Saving..."
        },
        success: "WhatsApp saved successfully."
      },
      queueSelect: {
        placeholder: "Select queues...",
        selectedSingle: "queue selected",
        selectedPlural: "queues selected",
        noQueues: "No queues available"
      },
      common: {
        mainInfo: "Main Information",
        messages: "Messages",
        queueSection: "Service Queues",
        defaultWhatsApp: "Set as default WhatsApp",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel"
      },
      qrCode: {
        message: "Read QrCode to start the session",
        title: "Connect WhatsApp",
        loading: "Generating QR Code...",
        scanInstruction: "Scan the QR Code to connect",
        waiting: "Waiting for QR Code...",
        stepsTitle: "Steps to access",
        step1Title: "Open WhatsApp",
        step1Description: "on your phone",
        step2Title: "Tap More options",
        step2Description: "on Android or Settings on iPhone",
        step3Title: "Tap Linked devices",
        step3Description: "then tap Link a device",
        step4Title: "Scan the QR Code",
        step4Description: "to confirm",
        securityNote:
          "Keep your phone connected to the internet to sync messages."
      },
      contacts: {
        title: "Contacts",
        toasts: {
          deleted: "Contact deleted sucessfully!"
        },
        searchPlaceholder: "Search ...",
        confirmationModal: {
          deleteTitle: "Delete",
          importTitlte: "Import contacts",
          deleteMessage:
            "Are you sure you want to delete this contact? All related tickets will be lost.",
          importMessage: "Do you want to import all contacts from the phone?"
        },
        buttons: {
          import: "Import Contacts",
          add: "Add Contact"
        },
        table: {
          name: "Name",
          whatsapp: "WhatsApp",
          email: "Email",
          actions: "Actions"
        }
      },
      contactModal: {
        title: {
          add: "Add contact",
          edit: "Edit contact"
        },
        form: {
          mainInfo: "Contact details",
          extraInfo: "Additional information",
          name: "Name",
          number: "Whatsapp number",
          email: "Email",
          extraName: "Field name",
          extraValue: "Value"
        },
        buttons: {
          addExtraInfo: "Add information",
          okAdd: "Add",
          okEdit: "Save",
          cancel: "Cancel"
        },
        success: "Contact saved successfully."
      },
      quickAnswersModal: {
        title: {
          add: "Add Quick Reply",
          edit: "Edit Quick Answer"
        },
        form: {
          mainInfo: "Main Information",
          shortcut: "Shortcut",
          message: "Quick Reply"
        },
        buttons: {
          okAdd: "Add",
          okEdit: "Save",
          cancel: "Cancel"
        },
        success: "Quick Reply saved successfully."
      },
      queueModal: {
        title: {
          add: "Add queue",
          edit: "Edit queue"
        },
        form: {
          mainInfo: "Queue Information",
          name: "Name",
          color: "Color",
          greetingMessage: "Greeting Message"
        },
        buttons: {
          okAdd: "Add",
          okEdit: "Save",
          cancel: "Cancel"
        },
        success: "Queue saved successfully."
      },
      userModal: {
        title: {
          add: "Add user",
          edit: "Edit user"
        },
        form: {
          mainInfo: "Main Information",
          name: "Name",
          email: "Email",
          password: "Password",
          profile: "Profile",
          whatsapp: "Default Connection",
          queues: "Queues"
        },
        buttons: {
          okAdd: "Add",
          okEdit: "Save",
          cancel: "Cancel"
        },
        success: "User saved successfully."
      },
      chat: {
        noTicketMessage: "Select a ticket to start chatting."
      },
      ticketsManager: {
        buttons: {
          newTicket: "New"
        }
      },
      ticketsQueueSelect: {
        placeholder: "Queues"
      },
      tickets: {
        toasts: {
          deleted: "The ticket you were on has been deleted."
        },
        notification: {
          message: "Message from"
        },
        tabs: {
          open: { title: "Inbox" },
          closed: { title: "Resolved" },
          search: { title: "Search" }
        },
        search: {
          placeholder: "Search tickets and messages."
        },
        buttons: {
          showAll: "All"
        }
      },
      transferTicketModal: {
        title: "Transfer Ticket",
        fieldLabel: "Type to search for users",
        fieldQueueLabel: "Transfer to queue",
        fieldConnectionLabel: "Transfer to connection",
        fieldQueuePlaceholder: "Please select a queue",
        fieldConnectionPlaceholder: "Please select a connection",
        noOptions: "No user found with this name",
        buttons: {
          ok: "Transfer",
          cancel: "Cancel"
        }
      },
      ticketsList: {
        pendingHeader: "Queue",
        assignedHeader: "Working on",
        noTicketsTitle: "Nothing here!",
        noTicketsMessage: "No tickets found with this status or search term.",
        connectionTitle: "Connection that is currently being used.",
        buttons: {
          accept: "Accept"
        }
      },
      newTicketModal: {
        title: "Create Ticket",
        fieldLabel: "Type to search for a contact",
        add: "Add",
        buttons: {
          ok: "Save",
          cancel: "Cancel"
        }
      },
      mainDrawer: {
        listItems: {
          attendances: "Attendances",
          administration: "Administration",
          dashboard: "Dashboard",
          connections: "Connections",
          tickets: "Tickets",
          contacts: "Contacts",
          quickAnswers: "Quick Answers",
          queues: "Queues",
          users: "Users",
          settings: "Settings"
        },
        appBar: {
          user: {
            profile: "Profile",
            logout: "Logout"
          }
        },
        tooltips: {
          theme: "Toggle theme",
          notifications: "Notifications",
          language: "Change language",
          profile: "User profile",
          logout: "Logout",
          menu: "Open menu",
          connectionAlert:
            "There are disconnected connections - Click to manage",
          themeLight: "Light Mode",
          themeDark: "Dark Mode",
          languageSection: "Language"
        }
      },
      notifications: {
        title: "Notifications",
        noTickets: "No notifications."
      },
      queues: {
        title: "Queues",
        table: {
          name: "Name",
          color: "Color",
          greeting: "Greeting message",
          actions: "Actions"
        },
        buttons: {
          add: "Add queue"
        },
        confirmationModal: {
          deleteTitle: "Delete",
          deleteMessage:
            "Are you sure? It cannot be reverted! Tickets in this queue will still exist, but will not have any queues assigned.",
          success: "Queue deleted successfully."
        }
      },
      quickAnswers: {
        title: "Quick Answers",
        table: {
          shortcut: "Shortcut",
          message: "Quick Reply",
          actions: "Actions"
        },
        buttons: {
          add: "Add Quick Reply"
        },
        toasts: {
          deleted: "Quick Reply deleted successfully."
        },
        searchPlaceholder: "Search...",
        confirmationModal: {
          deleteTitle: "Are you sure you want to delete this Quick Reply: ",
          deleteMessage: "This action cannot be undone."
        }
      },
      users: {
        title: "Users",
        table: {
          name: "Name",
          email: "Email",
          profile: "Profile",
          whatsapp: "Default Connection",
          actions: "Actions"
        },
        buttons: {
          add: "Add user"
        },
        toasts: {
          deleted: "User deleted sucessfully."
        },
        confirmationModal: {
          deleteTitle: "Delete",
          deleteMessage:
            "All user data will be lost. Users' open tickets will be moved to queue."
        }
      },
      settings: {
        success: "Settings saved successfully.",
        title: "Settings",
        loading: "Loading settings...",
        apiToken: {
          title: "API Token",
          description:
            "Token for system API access. Keep this token secure and do not share it.",
          placeholder: "Loading token...",
          copyButton: "Copy token",
          copySuccess: "Token copied to clipboard!",
          copyError: "Error copying token",
          securityTitle: "Important Security",
          securityDescription:
            "This token allows full API access. Do not share with third parties and keep it secure."
        },
        settings: {
          userCreation: {
            name: "User creation",
            description:
              "Controls whether new users can register in the system",
            options: {
              enabled: "Enabled",
              disabled: "Disabled"
            }
          }
        }
      },
      messagesList: {
        header: {
          assignedTo: "Assigned to:",
          buttons: {
            return: "Return",
            resolve: "Resolve",
            reopen: "Reopen",
            accept: "Accept"
          }
        }
      },
      messagesInput: {
        placeholderOpen:
          "Type a message or press ''/'' to use the registered quick responses",
        placeholderClosed: "Reopen or accept this ticket to send a message.",
        signMessage: "Sign"
      },
      contactDrawer: {
        header: "Contact details",
        buttons: {
          edit: "Edit contact"
        },
        extraInfo: "Other information"
      },
      ticketOptionsMenu: {
        delete: "Delete",
        transfer: "Transfer",
        confirmationModal: {
          title: "Delete ticket #",
          titleFrom: "from contact ",
          message: "Attention! All ticket's related messages will be lost."
        },
        buttons: {
          delete: "Delete",
          cancel: "Cancel"
        }
      },
      confirmationModal: {
        buttons: {
          confirm: "Ok",
          cancel: "Cancel"
        }
      },
      messageOptionsMenu: {
        delete: "Delete",
        reply: "Reply",
        confirmationModal: {
          title: "Delete message?",
          message: "This action cannot be reverted."
        }
      },
      errorBoundary: {
        title: "Something went wrong",
        message: "An unexpected error occurred. Please reload the page.",
        button: "Reload page"
      },
      backendErrors: {
        ERR_NO_OTHER_WHATSAPP:
          "There must be at lest one default WhatsApp connection.",
        ERR_NO_DEF_WAPP_FOUND:
          "No default WhatsApp found. Check connections page.",
        ERR_WAPP_NOT_INITIALIZED:
          "This WhatsApp session is not initialized. Check connections page.",
        ERR_WAPP_CHECK_CONTACT:
          "Could not check WhatsApp contact. Check connections page.",
        ERR_WAPP_INVALID_CONTACT: "This is not a valid whatsapp number.",
        ERR_WAPP_DOWNLOAD_MEDIA:
          "Could not download media from WhatsApp. Check connections page.",
        ERR_INVALID_CREDENTIALS: "Authentication error. Please try again.",
        ERR_SENDING_WAPP_MSG:
          "Error sending WhatsApp message. Check connections page.",
        ERR_DELETE_WAPP_MSG: "Couldn't delete message from WhatsApp.",
        ERR_OTHER_OPEN_TICKET:
          "There's already an open ticket for this contact.",
        ERR_SESSION_EXPIRED: "Session expired. Please login.",
        ERR_USER_CREATION_DISABLED:
          "User creation was disabled by administrator.",
        ERR_NO_PERMISSION: "You don't have permission to access this resource.",
        ERR_DUPLICATED_CONTACT: "A contact with this number already exists.",
        ERR_NO_SETTING_FOUND: "No setting found with this ID.",
        ERR_NO_CONTACT_FOUND: "No contact found with this ID.",
        ERR_NO_TICKET_FOUND: "No ticket found with this ID.",
        ERR_NO_USER_FOUND: "No user found with this ID.",
        ERR_NO_WAPP_FOUND: "No WhatsApp found with this ID.",
        ERR_CREATING_MESSAGE: "Error while creating message on database.",
        ERR_CREATING_TICKET: "Error while creating ticket on database.",
        ERR_FETCH_WAPP_MSG:
          "Error fetching the message in WhtasApp, maybe it is too old.",
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          "This color is already in use, pick another one.",
        ERR_WAPP_GREETING_REQUIRED:
          "Greeting message is required if there is more than one queue."
      }
    }
  }
};

export { messages };
