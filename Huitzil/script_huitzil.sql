USE [master]
GO
/****** Object:  Database [IndustriaHuitzil]    Script Date: 31/05/2022 09:28:39 p. m. ******/
CREATE DATABASE [IndustriaHuitzil]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'IndustriaHuitzil', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\IndustriaHuitzil.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'IndustriaHuitzil_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\IndustriaHuitzil_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [IndustriaHuitzil] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [IndustriaHuitzil].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [IndustriaHuitzil] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET ARITHABORT OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [IndustriaHuitzil] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [IndustriaHuitzil] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET  DISABLE_BROKER 
GO
ALTER DATABASE [IndustriaHuitzil] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [IndustriaHuitzil] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [IndustriaHuitzil] SET  MULTI_USER 
GO
ALTER DATABASE [IndustriaHuitzil] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [IndustriaHuitzil] SET DB_CHAINING OFF 
GO
ALTER DATABASE [IndustriaHuitzil] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [IndustriaHuitzil] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [IndustriaHuitzil] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [IndustriaHuitzil] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [IndustriaHuitzil] SET QUERY_STORE = OFF
GO
USE [IndustriaHuitzil]
GO
/****** Object:  Table [dbo].[Articulos]    Script Date: 31/05/2022 09:28:40 p. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CatCategorias]    Script Date: 31/05/2022 09:28:40 p. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CatProveedores]    Script Date: 31/05/2022 09:28:40 p. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CatTallas]    Script Date: 31/05/2022 09:28:40 p. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CatUbicaciones]    Script Date: 31/05/2022 09:28:40 p. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Materiales]    Script Date: 31/05/2022 09:28:40 p. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rol]    Script Date: 31/05/2022 09:28:40 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rol](
	[id_rol] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [nvarchar](50) NULL,
	[visible] [bit] NOT NULL
 CONSTRAINT [PK_Rol] PRIMARY KEY CLUSTERED 
(
	[id_rol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SolicitudesMateriales]    Script Date: 31/05/2022 09:28:40 p. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vistas]    Script Date: 31/05/2022 09:28:40 p. m. ******/
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
	[visible] [bit] DEFAULT(1) NOT NULL,
 CONSTRAINT [PK_Vistas] PRIMARY KEY CLUSTERED 
(
	[id_vista] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VistasRol]    Script Date: 31/05/2022 09:28:40 p. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 31/05/2022 09:28:40 p. m. ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
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
ALTER TABLE [dbo].[VistasRol]  WITH CHECK ADD  CONSTRAINT [FK_VistasRol_Rol] FOREIGN KEY([id_rol])
REFERENCES [dbo].[Rol] ([id_rol])
GO
USE [master]
GO
ALTER DATABASE [IndustriaHuitzil] SET  READ_WRITE 
GO
