USE [IndustriaHuitzil]
GO
/****** Object:  Table [dbo].[Articulos]    Script Date: 04/07/2022 05:22:47 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Articulos](
	[id_articulo] [int] IDENTITY(1,1) NOT NULL,
	[unidad] [varchar](50) NULL,
	[existencia] [varchar](50) NULL,
	[descripcion] [varchar](50) NULL,
	[fecha_ingreso] [date] NULL,
	[id_ubicacion] [int] NULL,
	[id_categoria] [int] NULL,
	[id_talla] [int] NULL,
 CONSTRAINT [PK_Articulos_1] PRIMARY KEY CLUSTERED 
(
	[id_articulo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CatCategorias]    Script Date: 04/07/2022 05:22:48 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CatCategorias](
	[id_categoria] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NULL,
	[descripcion] [varchar](50) NULL,
 CONSTRAINT [PK_CatCategorias] PRIMARY KEY CLUSTERED 
(
	[id_categoria] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CatProveedores]    Script Date: 04/07/2022 05:22:48 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CatProveedores](
	[id_proveedor] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](50) NULL,
	[apellido_paterno] [nvarchar](50) NULL,
	[apellido_materno] [nvarchar](50) NULL,
	[telefono1] [nvarchar](50) NULL,
	[telefono2] [nvarchar](80) NULL,
	[correo] [nvarchar](50) NULL,
	[direccion] [nvarchar](80) NULL,
	[encargado_nombre] [nvarchar](50) NULL,
 CONSTRAINT [PK_CatProveedores] PRIMARY KEY CLUSTERED 
(
	[id_proveedor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CatTallas]    Script Date: 04/07/2022 05:22:48 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CatTallas](
	[id_talla] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NULL,
	[descripcion] [varchar](50) NULL,
 CONSTRAINT [PK_CatTallas] PRIMARY KEY CLUSTERED 
(
	[id_talla] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CatUbicaciones]    Script Date: 04/07/2022 05:22:48 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CatUbicaciones](
	[id_ubicacion] [int] IDENTITY(1,1) NOT NULL,
	[direccion] [varchar](50) NULL,
	[nombre_encargado] [varchar](50) NULL,
	[apellidoP_encargado] [varchar](50) NULL,
	[apellidoM_encargado] [varchar](50) NULL,
	[telefono1] [varchar](50) NULL,
	[telefono2] [varchar](50) NULL,
	[correo] [varchar](50) NULL,
 CONSTRAINT [PK_CatUbicaciones] PRIMARY KEY CLUSTERED 
(
	[id_ubicacion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Materiales]    Script Date: 04/07/2022 05:22:48 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Materiales](
	[id_material] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](50) NULL,
	[descripcion] [nvarchar](50) NULL,
	[precio] [float] NULL,
	[tipo_medicion] [varchar](50) NULL,
	[status] [nchar](10) NULL,
	[id_proveedor] [int] NULL,
	[cantidad] [float] NULL,
 CONSTRAINT [PK_Materiales] PRIMARY KEY CLUSTERED 
(
	[id_material] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rol]    Script Date: 04/07/2022 05:22:48 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rol](
	[id_rol] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [nvarchar](50) NULL,
	[visible] [bit] NOT NULL,
 CONSTRAINT [PK_Rol] PRIMARY KEY CLUSTERED 
(
	[id_rol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SolicitudesMateriales]    Script Date: 04/07/2022 05:22:48 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SolicitudesMateriales](
	[id_solicitud] [int] IDENTITY(1,1) NOT NULL,
	[fecha] [date] NULL,
	[cantidad] [float] NULL,
	[id_material] [int] NULL,
	[comentarios] [varchar](50) NULL,
	[id_proveedor] [int] NULL,
	[status] [nchar](10) NULL,
	[fecha_update] [date] NULL,
	[costo_total] [float] NULL,
	[id_user] [int] NULL,
 CONSTRAINT [PK_SolicitudesMateriales] PRIMARY KEY CLUSTERED 
(
	[id_solicitud] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 04/07/2022 05:22:48 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[id_user] [int] IDENTITY(1,1) NOT NULL,
	[usuario] [nvarchar](50) NULL,
	[password] [varchar](50) NULL,
	[id_rol] [int] NULL,
	[nombre] [varchar](50) NULL,
	[apellido_paterno] [varchar](50) NULL,
	[apellido_materno] [varchar](50) NULL,
	[telefono] [varchar](50) NULL,
	[correo] [varchar](50) NULL,
	[token] [varchar](800) NULL,
	[ultimo_acceso] [datetime] NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[id_user] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vistas]    Script Date: 04/07/2022 05:22:48 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vistas](
	[id_vista] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](100) NOT NULL,
	[descripcion] [varchar](200) NOT NULL,
	[posicion] [int] NOT NULL,
	[routerLink] [varchar](100) NOT NULL,
	[visible] [bit] NOT NULL,
 CONSTRAINT [PK_Vistas] PRIMARY KEY CLUSTERED 
(
	[id_vista] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VistasRol]    Script Date: 04/07/2022 05:22:48 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VistasRol](
	[id_vista_rol] [int] IDENTITY(1,1) NOT NULL,
	[id_vista] [int] NOT NULL,
	[id_rol] [int] NOT NULL,
 CONSTRAINT [PK_VistasRol] PRIMARY KEY CLUSTERED 
(
	[id_vista_rol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Rol] ADD  CONSTRAINT [DF_Rol_visible]  DEFAULT ((1)) FOR [visible]
GO
ALTER TABLE [dbo].[Vistas] ADD  DEFAULT ((1)) FOR [visible]
GO
ALTER TABLE [dbo].[Articulos]  WITH CHECK ADD  CONSTRAINT [FK_Articulos_Categorias] FOREIGN KEY([id_categoria])
REFERENCES [dbo].[CatCategorias] ([id_categoria])
GO
ALTER TABLE [dbo].[Articulos] CHECK CONSTRAINT [FK_Articulos_Categorias]
GO
ALTER TABLE [dbo].[Articulos]  WITH CHECK ADD  CONSTRAINT [FK_Articulos_Tallas] FOREIGN KEY([id_talla])
REFERENCES [dbo].[CatTallas] ([id_talla])
GO
ALTER TABLE [dbo].[Articulos] CHECK CONSTRAINT [FK_Articulos_Tallas]
GO
ALTER TABLE [dbo].[Articulos]  WITH CHECK ADD  CONSTRAINT [FK_Articulos_Ubicaciones] FOREIGN KEY([id_ubicacion])
REFERENCES [dbo].[CatUbicaciones] ([id_ubicacion])
GO
ALTER TABLE [dbo].[Articulos] CHECK CONSTRAINT [FK_Articulos_Ubicaciones]
GO
ALTER TABLE [dbo].[SolicitudesMateriales]  WITH CHECK ADD  CONSTRAINT [FK_SolicitudesMateriales_Materiales] FOREIGN KEY([id_material])
REFERENCES [dbo].[Materiales] ([id_material])
GO
ALTER TABLE [dbo].[SolicitudesMateriales] CHECK CONSTRAINT [FK_SolicitudesMateriales_Materiales]
GO
ALTER TABLE [dbo].[SolicitudesMateriales]  WITH CHECK ADD  CONSTRAINT [FK_SolicitudesMateriales_Proveedores] FOREIGN KEY([id_proveedor])
REFERENCES [dbo].[CatProveedores] ([id_proveedor])
GO
ALTER TABLE [dbo].[SolicitudesMateriales] CHECK CONSTRAINT [FK_SolicitudesMateriales_Proveedores]
GO
ALTER TABLE [dbo].[SolicitudesMateriales]  WITH CHECK ADD  CONSTRAINT [FK_SolicitudesMateriales_Users] FOREIGN KEY([id_user])
REFERENCES [dbo].[Users] ([id_user])
GO
ALTER TABLE [dbo].[SolicitudesMateriales] CHECK CONSTRAINT [FK_SolicitudesMateriales_Users]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Rol] FOREIGN KEY([id_rol])
REFERENCES [dbo].[Rol] ([id_rol])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Rol]
GO
ALTER TABLE [dbo].[VistasRol]  WITH CHECK ADD  CONSTRAINT [FK_VistaRol_Vista] FOREIGN KEY([id_vista])
REFERENCES [dbo].[Vistas] ([id_vista])
GO
ALTER TABLE [dbo].[VistasRol] CHECK CONSTRAINT [FK_VistaRol_Vista]
GO
ALTER TABLE [dbo].[VistasRol]  WITH CHECK ADD  CONSTRAINT [FK_VistasRol_Rol] FOREIGN KEY([id_rol])
REFERENCES [dbo].[Rol] ([id_rol])
GO
ALTER TABLE [dbo].[VistasRol] CHECK CONSTRAINT [FK_VistasRol_Rol]
GO
